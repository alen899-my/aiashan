from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users
from database.connection import engine
from database import base

# Create tables in Neon automatically
try:
    base.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creating database tables: {e}")


app = FastAPI(title="AI Ashan")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aiashan.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(users.router)

@app.get("/")
def home():
    return {"message": "AI Ashan API is Live"}