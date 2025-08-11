from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List
import models
from core.oauth import get_current_user, get_admin_user
from models import PickupRequest, User
from schemas.pickup import PickupRequestCreate, PickupRequestOut
from database import get_db
from services.pickup import create_pickup as create, update_pickup_by_id, delete_pickup_by_id
from services.pickup import get_pickup_by_id as get_pickup_by_id_service
from fastapi import UploadFile, File
import shutil
import os
from uuid import uuid4, UUID

UPLOAD_DIR = "uploads"


pickup_router = APIRouter(prefix="/pickup", tags=["Pickup Requests"])

@pickup_router.post("/", response_model=PickupRequestOut)
def create_pickup(
    request: PickupRequestCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    created = create(db, request, user_id=user.id)
    return created

@pickup_router.get("/" , response_model=List[PickupRequestOut])
def get_all_pickups(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(PickupRequest).all()

@pickup_router.get("/{id}", response_model=PickupRequestOut)
def get_pickup_by_id_route(
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


@pickup_router.post("/upload-image/{pickup_id}")
def upload_pickup_image(
    pickup_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Find existing pickup
    pickup = db.query(models.PickupRequest).filter(PickupRequest.id == pickup_id).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found")

    # Generate unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file to local folder
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update pickup record with new image path
    pickup.image_path = file_path
    db.commit()
    db.refresh(pickup)

    return {
        "pickup_id": pickup.id,
        "filename": filename,
        "url": f"/{UPLOAD_DIR}/{filename}"
    }


@pickup_router.delete("/{id}")
def delete_pickup(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return delete_pickup_by_id(db, id)


