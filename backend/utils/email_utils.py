# utils/email_utils.py - PRODUCTION VERSION
import logging
from fastapi_mail import MessageSchema
from core.email_config import fast_mail, jinja_env
from core.config import settings

logger = logging.getLogger(__name__)

async def send_password_reset_email(email: str, user: dict, reset_token: str):
    """PRODUCTION: Send real password reset email"""
    try:
        if fast_mail is None:
            logger.error("Email service not configured")
            return False
        if jinja_env is None:
            logger.error("Template environment not configured")
            return False

        reset_link = f"{settings.APP_BASE_URL}/reset-password?token={reset_token}"

        # Render HTML template
        template = jinja_env.get_template("reset_password_email.html")
        html_body = template.render(
            user=user,
            reset_link=reset_link,
            app_name=settings.APP_NAME
        )

        # Create message
        message = MessageSchema(
            subject=f"Password Reset Request - {settings.APP_NAME}",
            recipients=[email],
            body=html_body,
            subtype="html"
        )

        # Send email
        await fast_mail.send_message(message)
        logger.info(f"✅ Password reset email sent to {email}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to send password reset email: {str(e)}")
        return False

async def send_welcome_email(email: str, user: dict):
    """PRODUCTION: Send real welcome email"""
    try:
        if fast_mail is None or jinja_env is None:
            return False

        template = jinja_env.get_template("welcome_email.html")
        html_body = template.render(
            user=user,
            app_name=settings.APP_NAME,
            support_email=settings.MAIL_FROM
        )

        message = MessageSchema(
            subject=f"Welcome to {settings.APP_NAME}!",
            recipients=[email],
            body=html_body,
            subtype="html"
        )

        await fast_mail.send_message(message)
        logger.info(f"✅ Welcome email sent to {email}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to send welcome email: {str(e)}")
        return False