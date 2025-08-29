from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import EmailStr


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Waste Management API"
    APP_BASE_URL: str = "http://localhost:8000"
    DEBUG: bool = True

    # Database
    SQLALCHEMY_DATABASE_URL: str

    # JWT
    SECRET_KEY: str  # your main JWT secret
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    # Mail
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
