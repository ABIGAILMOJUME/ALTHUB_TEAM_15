from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models import Report
from schemas.report import ReportCreate, ReportOut
from database import get_db
from typing import List

report_router = APIRouter(prefix="/reports", tags=["Reports"])

@report_router.post("/", response_model=ReportOut)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    new_report = Report(**report.model_dump())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@report_router.get("/", response_model=List[ReportOut])
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()
