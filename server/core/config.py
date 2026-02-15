import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Ashan Backend"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")

if not settings.DATABASE_URL:
    print("WARNING: DATABASE_URL environment variable is not set.")
if not settings.GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY environment variable is not set.")

settings = Settings()