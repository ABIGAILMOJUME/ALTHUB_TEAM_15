from fastapi import APIRouter, Depends, Path, UploadFile,File, status
import os
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from core.oauth import get_current_user
from models import PickupRequest, User
from schemas.pickup import PickupRequestCreate, PickupRequestOut
from database import get_db
from services.pickup import create_pickup as create, update_pickup_by_id, delete_pickup_by_id, save_pickup_image
from services.pickup import get_pickup_by_id as get_pickup_by_id_service

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

pickup_router = APIRouter(prefix="/pickup", tags=["Pickup Requests"])

@pickup_router.post("/", status_code=status.HTTP_201_CREATED, response_model=PickupRequestOut)
def create_pickup(
    request: PickupRequestCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    created = create(db, request, user_id=user.id)
    return created

@pickup_router.get("/", status_code=status.HTTP_200_OK, response_model=List[PickupRequestOut])
def get_all_pickups(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(PickupRequest).all()

@pickup_router.get("/{id}",status_code=status.HTTP_200_OK, response_model=PickupRequestOut)
def get_pickup_by_id(
    id: str = Path(..., title="The ID of the pickup request to retrieve"),
    db: Session = Depends(get_db,),
    user: User = Depends(get_current_user)
):
    pickup = get_pickup_by_id_service(db, id)
    return pickup

@pickup_router.put("/{id}", response_model=PickupRequestOut)
def update_pickup(
    id: str,
    update_data: PickupRequestCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return update_pickup_by_id(db, id, update_data)

@pickup_router.post("/upload-image/{pickup_id}", status_code=status.HTTP_201_CREATED)
def upload_pickup_image_endpoint(
    pickup_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return save_pickup_image(db, pickup_id, file)

@pickup_router.delete("/{id}")
def delete_pickup(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return delete_pickup_by_id(db, id)


