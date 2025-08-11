from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.security import authenticate_user
from core.oauth import create_token
from database import get_db
import logging

login_router = APIRouter(tags=["Authentication"])

logger = logging.getLogger(__name__)

@login_router.post("/login")
def login(credential: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info("Authenticating user...")

    user = authenticate_user(db, email=credential.username, password=credential.password)
    if not user:
        logger.warning("Login failed: Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_token(data={"sub": user.email, "is_admin": user.is_admin})
    logger.info(f"Token issued for {user.email}")

    return {"access_token": access_token, "token_type": "bearer"}
