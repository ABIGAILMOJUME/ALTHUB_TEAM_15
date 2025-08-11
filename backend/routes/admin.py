from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.oauth import get_admin_user
from models import PickupRequest
from database import get_db
from schemas.pickup import PickupRequestOut
from models import User

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

@admin_router.get("/pickups", response_model=List[PickupRequestOut])
def get_all_pickups(db: Session = Depends(get_db)):
    return db.query(PickupRequest).all()

@admin_router.patch("/pickup/{pickup_id}/status", response_model=PickupRequestOut)
def update_pickup_status(
    pickup_id: str,
    status: str,
    db: Session = Depends(get_db),
):
    pickup = db.query(PickupRequest).filter(PickupRequest.id == pickup_id).first()

    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found")

    pickup.status = status
    db.commit()
    db.refresh(pickup)
    return pickup
