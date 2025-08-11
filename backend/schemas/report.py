
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class ReportBase(BaseModel):
    user_id: UUID
    location: str
    issue_type: str
    description: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportOut(ReportBase):
    id: UUID
    created_at: datetime
    status: str  # e.g., "open", "in_progress", "resolved"

    model_config = {
        "from_attributes": True
    }
