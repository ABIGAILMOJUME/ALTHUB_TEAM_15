from fastapi_mail import FastMail, ConnectionConfig
from jinja2 import Environment, FileSystemLoader
import logging
import os
from core.config import settings

logger = logging.getLogger(__name__)

os.makedirs("templates", exist_ok=True)

# Email configuration
try:
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
        TIMEOUT=10,
        TEMPLATE_FOLDER="templates"
    )
    fast_mail = FastMail(conf)
    logger.info("Production email configuration loaded")
    logger.info(f"Server: {settings.MAIL_SERVER}")
    logger.info(f"From: {settings.MAIL_FROM}")

except Exception as e:
    logger.error(f"Email configuration error: {e}")
    fast_mail = None

# Template environment
try:
    jinja_env = Environment(loader=FileSystemLoader("templates"))
    logger.info("Template environment loaded successfully")
except Exception as e:
    logger.error(f"Template environment error: {e}")
    jinja_env = None