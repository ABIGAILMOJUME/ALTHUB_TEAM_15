from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from backend.core.config import settings
from jinja2 import Environment, FileSystemLoader

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
)

fm = FastMail(conf)


env = Environment(loader=FileSystemLoader("templates"))
