from fastapi import FastAPI
from app.api.resume import router as resume_router

app = FastAPI(title="CareerPilot")

app.include_router(
    resume_router,
    prefix="/resume"
)

@app.get("/")
def home():
    return {"message": "Welcome to Career Pilot"}