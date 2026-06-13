from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.services.add_job import save_job
from app.db.database import get_db
from app.models.job_schema import JobCreate

router = APIRouter()

@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db)
):
    try:
        save_job(db, job)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"{e}"
        )     

    return {
        "message": "Job saved successfully"
    }  
