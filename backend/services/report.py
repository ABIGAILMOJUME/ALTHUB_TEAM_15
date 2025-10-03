import os
import shutil
from uuid import uuid4, UUID
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from models import Report
from typing import Optional


UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "bmp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

os.makedirs(UPLOAD_DIR, exist_ok=True)


def validate_file(file: UploadFile) -> None:
    if file:
        # Check file extension
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Check file size
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // 1024 // 1024}MB"
            )


def create_user_report(
        db: Session,
        user_id: UUID,
        issue_type: str,
        location: Optional[str] = None,
        description: Optional[str] = None,
        file: Optional[UploadFile] = None
):

    image_path = None

    try:
        # Validate file if provided
        if file:
            validate_file(file)

            file_ext = file.filename.split(".")[-1].lower()
            filename = f"{uuid4()}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)

            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            image_path = file_path

        # Create new report
        new_report = Report(
            user_id=user_id,
            location=location,
            issue_type=issue_type,
            description=description,
            image_path=image_path,
        )

        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return new_report

    except HTTPException:
        raise
    except Exception as e:
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create report: {str(e)}"
        )


def get_user_reports(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(Report).filter(Report.user_id == user_id).offset(skip).limit(limit).all()


def get_user_report(db: Session, report_id: UUID, user_id: UUID):
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    return report


def delete_user_report(db: Session, report_id: UUID, user_id: UUID):
    try:
        report = db.query(Report).filter(
            Report.id == report_id,
            Report.user_id == user_id
        ).first()

        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )

        db.delete(report)
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete report: {str(e)}"
        )
