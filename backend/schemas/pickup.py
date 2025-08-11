from enum import Enum
from pydantic import BaseModel
from datetime import datetime, date
from uuid import UUID

class PickupRequestBase(BaseModel):
    location: str
    waste_type: str
    scheduled_date: datetime

class PickupRequestCreate(PickupRequestBase):
    pass

class PickupRequest(PickupRequestBase):
    id: UUID
    user_id: UUID


class PickupStatus(Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class PickupRequestOut(BaseModel):
    id: UUID
    user_id: UUID
    location: str
    waste_type: str
    scheduled_date: datetime
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }