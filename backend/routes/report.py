from typing import List, Optional
from uuid import uuid4, UUID
from fastapi import APIRouter, UploadFile, File, Form, Depends, status
from sqlalchemy.orm import Session
from backend.core.oauth import get_current_user
from backend.models import Report, User
from backend.database import get_db
from backend.schemas.report import ReportOut
from backend.services.report import get_user_reports, get_user_report, delete_user_report, create_user_report


report_router = APIRouter(prefix="/report", tags=["Report"])


@report_router.post("/", status_code=status.HTTP_201_CREATED, response_model=ReportOut)
async def create_report(
        issue_type: str = Form(...),
        location: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        file: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):

    return create_user_report(
        db=db,
        user_id=current_user.id,
        issue_type=issue_type,
        location=location,
        description=description,
        file=file
    )

@report_router.get("/", response_model=List[ReportOut])
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_reports(db, current_user.id, skip, limit)

@report_router.get("/{report_id}", response_model=ReportOut)
async def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_user_report(db, report_id, current_user.id)

@report_router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    delete_user_report(db, report_id, current_user.id)
    return None