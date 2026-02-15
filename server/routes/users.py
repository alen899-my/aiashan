from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import UserProfile
from schemas.user import UserCreate, UserResponse
from lib.groq_client import generate_ashan_plan

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if user exists
    existing = db.query(UserProfile).filter(UserProfile.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Warrior email already exists")

    # 2. Create the user object from schema
    user_data = user.dict()
    new_user = UserProfile(**user_data)
    
    # 3. Trigger AI Logic immediately (Grok Integration)
    # We pass the user metrics to the AI client
    try:
        ai_generated_plan = generate_ashan_plan(user_data)
        new_user.ai_plan = ai_generated_plan
    except Exception as e:
        # Fallback if AI fails so the registration doesn't crash
        new_user.ai_plan = "AI Strategy initialization pending..."

    # 4. Save everything to Neon DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Warrior not found")
    return user