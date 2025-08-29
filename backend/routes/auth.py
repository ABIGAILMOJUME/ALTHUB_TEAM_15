from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_mail import MessageSchema
from pygments.lexers import templates
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

from core.config import settings
from core.email import env, fm
from core.security import authenticate_user, hash_password
from core.oauth import create_token, RESET_TOKEN_EXPIRE_MINUTES, decode_token
from database import get_db
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address
from schemas.login import ForgotPassword, ResetPassword
from services.user import get_user_by_email

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
@limiter.limit("3/minute")
def forgot_password(
    request: Request,
    payload: ForgotPassword, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail= f"user not found"
        )
        
    reset_token = create_token(
        data={"sub": user.email, "reset": True},
        expires_delta = timedelta(minutes= RESET_TOKEN_EXPIRE_MINUTES)
    )
    
    reset_link = f"{settings.APP_BASE_URL}/auth/reset-password?token={reset_token}"
    logger.info(f"Password reset link generated for {user.email}")

    html_body = templates.get_template("reset_password_email.html").render(
        {"email": user.email, "reset_link": reset_link}
    )

    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[user.email],
        body=html_body,
        subtype="html",
    )

    background_tasks.add_task(fm.send_message, message)


    return {"message": "Password reset link generated", "reset_link": reset_link}

@login_router.get("/reset-password", response_class=HTMLResponse)
async def show_reset_form(request: Request, token: str):
    payload = decode_token(token)
    if not payload or not payload.get("reset"):
        return templates.TemplateResponse(
            "reset_password_form.html",
            {"request": request, "error": "Invalid or expired token", "token": token}
        )

    return templates.TemplateResponse(
        "reset_password_form.html",
        {"request": request, "token": token}
    )


@login_router.post("/reset-password", response_class=HTMLResponse)
async def reset_password(
    request: Request,
    token: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload or not payload.get("reset"):
        return templates.TemplateResponse(
            "reset_password_form.html",
            {"request": request, "error": "Invalid or expired token", "token": token}
        )

    email = payload.get("sub")
    user = get_user_by_email(db, email)
    if not user:
        return templates.TemplateResponse(
            "reset_password_form.html",
            {"request": request, "error": "User not found", "token": token}
        )

    user.hashed_password = hash_password(new_password)
    db.commit()

    return templates.TemplateResponse(
        "reset_password_form.html",
        {"request": request, "success": "Password reset successful. You may close this page.", "token": token}
    )