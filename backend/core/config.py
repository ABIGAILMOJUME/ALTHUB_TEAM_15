from pydantic_settings import BaseSettings
from pydantic import EmailStr, Field
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Waste Management API"
    APP_BASE_URL: str = "http://localhost:8000"
    DEBUG: bool = True

    # Database
    SQLALCHEMY_DATABASE_URL: str = Field(..., env="SQLALCHEMY_DATABASE_URL")

    # JWT
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    # Mail
    MAIL_USERNAME: str = Field(..., env="MAIL_USERNAME")
    MAIL_PASSWORD: str = Field(..., env="MAIL_PASSWORD")
    MAIL_FROM: EmailStr = Field(..., env="MAIL_FROM")
    MAIL_PORT: int = 587
    MAIL_SERVER: str = Field(..., env="MAIL_SERVER")
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()