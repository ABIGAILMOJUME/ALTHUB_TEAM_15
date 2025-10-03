from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator



class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"

class UserBase(BaseModel):
    name: str
    email: EmailStr



class UserCreate (UserBase):
    password: str
    role: Role = Role.USER

class UserOut(BaseModel):
    name: str
    email: EmailStr
    created_at : datetime

    model_config = {
        "from_attributes": True
    }

class UserLogin (BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str

class TokenData(BaseModel):
    email : Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str


    model_config = {
        "from_attributes": True
    }


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str