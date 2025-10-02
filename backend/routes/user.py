from fastapi import Depends, HTTPException, status, APIRouter, Form
from sqlalchemy.orm import Session
from typing import List, Annotated
import backend.models as models
from backend.database import get_db
from backend.schemas.user import UserCreate, UserOut
from backend.services.user import logger, get_user_by_email, create_user
from backend.core import security

user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def signup(user_data: Annotated[UserCreate, Form()], db: Session = Depends(get_db)):
    logger.info('Checking if user exists...')

    db_user = get_user_by_email(db, email=user_data.email)
    if db_user:
        logger.warning(f"User with email {user_data.email} already exists.")
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = security.hash_password(user_data.password)

    logger.info('Creating new user...')
    new_user = create_user(db, user_data, hashed_password)
    logger.info('User successfully created.')

    return new_user

@user_router.get("/",  response_model=List[UserOut])
def get_all_users(db:Session = Depends(get_db)):
    return db.query(models.User).all()
