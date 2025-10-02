from sqlalchemy import func
from backend.logger import get_logger
from sqlalchemy.orm import Session
import backend.models as models
from backend.schemas.user import UserCreate

logger = get_logger(__name__)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(
        func.lower(models.User.email) == email.lower()
    ).first()

def create_user(db: Session, user_data: UserCreate, hashed_password: str):
    db_user = models.User(
        name=user_data.name,
        email=user_data.email.lower(),
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user