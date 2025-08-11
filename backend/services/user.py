from logger import get_logger
from sqlalchemy.orm import Session

import models
from schemas.user import UserCreate

logger = get_logger(__name__)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user_data: UserCreate, hashed_password: str):
    db_user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user