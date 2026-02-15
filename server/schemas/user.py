from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    first_name: str
    email: EmailStr
    phone: str
    age: int
    height: float
    weight: float
    goal: str
    experience: str
    frequency: int

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    ai_plan: Optional[str] = None # Add this line

    class Config:
        from_attributes = True