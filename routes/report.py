import os
import shutil
from typing import List
from uuid import uuid4, UUID
from fastapi import APIRouter, UploadFile, File, Form, Depends, status
from sqlalchemy.orm import Session

from core.oauth import get_current_user
from models import Report, User
from database import get_db
from schemas.report import ReportOut


UPLOAD_DIR = "uploads"

report_router = APIRouter( prefix="/report", tags=["Report"])

@report_router.post("/", status_code=status.HTTP_201_CREATED, response_model=ReportOut)
async def create_report(
    user_id: UUID = Form(...),
    location: str = Form(None),
    issue_type: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    image_path = None

    if file:
        file_ext = file.filename.split(".")[-1]
        filename = f"{uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_path = file_path

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
