from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request
import logging
from core.oauth import create_reset_token
from models import User
from schemas.login import ForgotPassword, ResetPassword
from starlette.responses import JSONResponse
from utils.email_utils import send_password_reset_email
from database import get_db

logger = logging.getLogger(__name__)

class AuthServices:
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

        reset_token = create_reset_token(user.email)

        user_data = {
            "name": user.name if user.name else "User",
            "email": user.email
        }

        # Send email in background
        background_tasks.add_task(
            send_password_reset_email,
            user.email,
            user_data,
            reset_token
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
            content={"message": "If the email exists, a reset link has been sent"}
        )


  @staticmethod
  async def reset_password(
        db: Session,
        request: ResetPassword
):
    try:
        # Verify the reset token
        from core.oauth import verify_reset_token
        email = verify_reset_token(request.token)

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        # Find user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update password
        from core.security import hash_password
        user.hashed_password = hash_password(request.new_password)
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
