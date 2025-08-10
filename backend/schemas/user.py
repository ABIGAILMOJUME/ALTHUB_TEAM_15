from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: str

""""@field_validator('password')
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one digit")
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one uppercase letter")
        return v"""


class UserCreate (UserBase):
    pass


class UserOut(BaseModel):
    name: str
    email: EmailStr
    created_at : datetime

    model_config = {
        "from_attributes": True
    }