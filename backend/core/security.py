from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.services.user import get_user_by_email

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email.lower())
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user



