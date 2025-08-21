import uuid
from fastapi import HTTPException,status
from sqlalchemy.orm import Session
import logger
import models
from schemas.pickup import PickupRequestCreate

logger = logger.get_logger(__name__)

def create_pickup(db: Session, request: PickupRequestCreate, user_id: uuid.UUID):
    db_pickup = models.PickupRequest(
        **request.model_dump(),
        user_id=user_id
    )
    db.add(db_pickup)
    db.commit()
    db.refresh(db_pickup)
    return db_pickup

def get_pickup_by_id(db: Session, id: str):
    logger.info("Querying PickupRequest model")
    pickup = db.query(models.PickupRequest).filter(models.PickupRequest.id == id).first()

    if not pickup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup request with ID {id} not found"
        )
    return pickup

def update_pickup_by_id(db: Session, id: str, update_data: PickupRequestCreate):
    pickup = db.query(models.PickupRequest).filter(models.PickupRequest.id == id).first()

    if not pickup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup request with ID {id} not found"
        )

    for key, value in update_data.model_dump().items():
        setattr(pickup, key, value)

    db.commit()
    db.refresh(pickup)
    return pickup


def delete_pickup_by_id(db: Session, id: str):
    pickup = db.query(models.PickupRequest).filter(models.PickupRequest.id == id).first()

    if not pickup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup request with ID {id} not found"
        )

    db.delete(pickup)
    db.commit()
    return {"message": f"Pickup request with ID {id} deleted successfully"}
