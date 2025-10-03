from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request
import logging
import models
from core.security import (authenticate_user, create_access_token,
create_refresh_token, SECRET_KEY, ALGORITHM,
verify_refresh_token, get_password_hash)
from models import User
from starlette.responses import JSONResponse
from schemas.user import UserCreate, ResetPassword, ForgotPassword
from utils.email_utils import send_password_reset_email
from database import get_db


logger = logging.getLogger(__name__)

class AuthServices:
    @staticmethod
    def login(db: Session, form_data: OAuth2PasswordRequestForm):
        logger.info("Authenticating user...")
        user = authenticate_user(db, email=form_data.username, password=form_data.password)
        if not user:
            logger.warning("Login failed: Invalid credentials")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email or password is incorrect",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(sub=user.email, roles=[user.role])
        refresh_token = create_refresh_token({"sub": user.email})

        logger.info(f"Tokens issued for {user.email}")
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    def register(db: Session, user_data: UserCreate, password_hash: str, role: str = "user"):

        user = models.User(
            name=user_data.name,
            email=user_data.email.lower(),
            password_hash=password_hash,
            role=role
        )
        db.add(user)
        db.flush()
        db.refresh(user)
        return user

    @staticmethod
    def refresh_token(db: Session, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

            # Validate token type
            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )

            user_email = payload.get("sub")
            if user_email is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )

        except jwt.ExpiredSignatureError:
            logger.error("Refresh token expired")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )
        except jwt.PyJWTError as e:
            logger.error(f"Invalid refresh token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Check if user exists
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        new_access_token = create_access_token(sub=user.email, roles=[user.role])
        new_refresh_token = create_refresh_token({"sub": user.email})
        logger.info(f"Tokens refreshed for {user.email}")
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    def logout(db: Session, token: str):
        try:
            existing = db.query(models.BlacklistedToken).filter(models.BlacklistedToken.token == token).first()
            if existing:
                return {"message": "Token already blacklisted"}

            blacklisted_token = models.BlacklistedToken(token=token)
            db.add(blacklisted_token)
            db.commit()
            db.refresh(blacklisted_token)

            return {"message": "Successfully logged out"}

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error during logout: {str(e)}"
            )


    @staticmethod
    async def forgot_password(
        db: Session,
        request: ForgotPassword,
        background_tasks: BackgroundTasks

):
     try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            return JSONResponse(
                status_code=200,
                content={"message": "If the email exists, a reset link has been sent"}
            )

        refresh_token = create_refresh_token(user.email)

        user_data = {
            "name": user.name if user.name else "User",
            "email": user.email
        }

        # Send email in background
        background_tasks.add_task(
            send_password_reset_email,
            user.email,
            user_data,
            refresh_token
        )

        logger.info(f"Password reset process initiated for {request.email}")

        return JSONResponse(
            status_code=200,
            content={"message": "If the email exists, a reset link has been sent"}
        )

     except Exception as e:
         logger.error(f"Error in forgot_password: {str(e)}")
         return JSONResponse(
            status_code=200,
            content={"message": "If the email exists, a reset link has been sent"})


    @staticmethod
    async def reset_password(
        db: Session,
        request: ResetPassword
):
     try:
        email = verify_refresh_token(request.token)

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update password
        user.hashed_password = get_password_hash(request.new_password)
        db.commit()

        logger.info(f"Password reset successfully for {email}")
        return JSONResponse(
            status_code=200,
            content={"message": "Password reset successfully"}
        )

     except Exception as e:
        logger.error(f"Error in reset_password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to reset password"
        )

Auth_Service = AuthServices()
