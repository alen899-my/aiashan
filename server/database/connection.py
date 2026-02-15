from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings
from database.base import Base

if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    engine = None
    SessionLocal = None

def get_db():
    if SessionLocal is None:
        raise Exception("Database not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()