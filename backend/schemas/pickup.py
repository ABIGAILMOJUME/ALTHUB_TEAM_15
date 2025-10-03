from enum import Enum
from pydantic import BaseModel
from datetime import datetime, date
from uuid import UUID

class PickupRequestBase(BaseModel):
    location: str
    waste_type: str
    scheduled_date: datetime
    image_path: str

class PickupRequestCreate(PickupRequestBase):
    pass

class PickupRequest(PickupRequestBase):
    id: UUID
    user_id: UUID


class PickupStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


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