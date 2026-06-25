print("1")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
print("2")

print("3")
from app.api.resume import router as resume_router
print("4")

from app.api.job import router as job_router
print("5")

from app.api.matcher import router as match_router
print("6")

from app.api.analyser import router as analyse_router
print("7")

from app.api.history import router as history_router
print("8")

app = FastAPI(title="CareerPilot")
print("9")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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