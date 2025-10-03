import shutil
import uuid, os, logger
from fastapi import HTTPException,status, UploadFile,File
from sqlalchemy.orm import Session
import models
from schemas.pickup import PickupRequestCreate

UPLOAD_DIR = "upload"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}


os.makedirs(UPLOAD_DIR, exist_ok=True)

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

def save_pickup_image(
        db: Session,
        pickup_id: uuid.UUID,
        file: UploadFile = File(...)
):

    # Find existing pickup
    pickup = db.query(models.PickupRequest).filter(models.PickupRequest.id == pickup_id).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found")

    # Validate file type
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validate file size
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // 1024 // 1024}MB"
        )

    # Generate unique filename
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
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
            "file_path": file_path,
            "url": f"/{UPLOAD_DIR}/{filename}",
            "message": "Image uploaded successfully"
        }

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image: {str(e)}"
        )

