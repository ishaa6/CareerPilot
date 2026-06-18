from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.services.job.add_job import (save_job, get_all_jobs)
from app.db.database import get_db
from app.models.job_schema import JobCreate

router = APIRouter()

@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db)
):
    try:
        job_data = save_job(db, job)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"{e}"
        )     

    return {
        "message": "Job saved successfully",
        "job_id": job_data.id
    }  

@router.get("/")
def list_jobs(
    db = Depends(get_db)
):

    jobs = get_all_jobs(db)

    return [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company
        }
        for job in jobs
    ]