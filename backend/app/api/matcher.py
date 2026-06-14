from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.services.resume.get_resume import get_resume_by_id
from app.services.job.get_job import get_job_by_id

from app.agents.jd_matcher import match_resmue_jd

router = APIRouter()

@router.post("/match")
def match_resume(
    resume_id: str,
    job_id: str,
    db: Session = Depends(get_db)
):
    resume = get_resume_by_id(db, resume_id)

    if not resume:
        raise HTTPException(
            status_code = 404,
            detail = "Resume not found"
        )
    
    job = get_job_by_id(db, job_id)

    if not job:
        raise HTTPException(
            status_code = 404,
            detail = "Job not found"
        ) 
    
    return match_resmue_jd(
        resume.raw_text,
        job.description
    )