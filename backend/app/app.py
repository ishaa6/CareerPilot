from fastapi import FastAPI
from app.api.resume import router as resume_router
from app.api.job import router as job_router
from app.api.matcher import router as match_router

app = FastAPI(title="CareerPilot")

app.include_router(
    resume_router,
    prefix="/resume"
)

app.include_router(
    job_router,
    prefix="/job"
)

app.include_router(
    match_router,
    prefix="/job"
)

@app.get("/")
def home():
    return {"message": "Welcome to Career Pilot"}