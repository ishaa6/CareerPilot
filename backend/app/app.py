from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.resume import router as resume_router
from app.api.job import router as job_router
from app.api.matcher import router as match_router
from app.api.analyser import router as analyse_router
from app.api.history import router as history_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CareerPilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://localhost:3000",  # CRA
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(
    analyse_router,
    prefix="/analyse"
)

app.include_router(
    history_router,
    prefix="/history"
)

@app.get("/")
def home():
    return {"message": "Welcome to Career Pilot"}