from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.services.auth import AuthServices
from backend.core.security import authenticate_user
from backend.core.oauth import create_token
from backend.database import get_db
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address
from backend.schemas.login import ForgotPassword, ResetPassword


login_router = APIRouter(tags=["Authentication"])

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

@login_router.post("/login", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def login(request: Request, credential: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info("Authenticating user...")

    user = authenticate_user(db, email=credential.username, password=credential.password)
    if not user:
        logger.warning("Login failed: Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_token(data={"sub": user.email, "is_admin": user.is_admin})
    logger.info(f"Token issued for {user.email}")

    return {"access_token": access_token, "token_type": "bearer"}


@login_router.post("/forgot-password", status_code=status.HTTP_201_CREATED)
async def forgot_password(
        request: ForgotPassword,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db)
):
    password = await AuthServices.forgot_password(db, request, background_tasks)
    return password


@login_router.post("/reset-password", status_code=status.HTTP_201_CREATED)
async def reset_password(
        request: ResetPassword,
        db: Session = Depends(get_db)
):

    password =await AuthServices.reset_password(db, request)
    return password