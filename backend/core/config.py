from pydantic_settings import BaseSettings
from pydantic import EmailStr, Field
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Waste Management API"
    APP_BASE_URL: str
    DEBUG: bool = True

    # Database
    SQLALCHEMY_DATABASE_URL: str = Field(..., env="SQLALCHEMY_DATABASE_URL")

    # JWT
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRES_DAYS: int = 10


    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()