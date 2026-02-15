from sqlalchemy import Column, Integer, String, Float, Text
from database.base import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    password = Column(String, nullable=False)
    age = Column(Integer)
    height = Column(Float)
    weight = Column(Float)
    goal = Column(String)
    experience = Column(String)
    frequency = Column(Integer)
    # New column for AI logic
    ai_plan = Column(Text, nullable=True)