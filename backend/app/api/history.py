from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.analysis.get_analysis import list_analyses, get_analysis_by_id
from app.services.analysis.delete_analysis import delete_analysis_by_id

router = APIRouter()

@router.get("/")
def get_history(
    db: Session = Depends(get_db)
):
    rows = list_analyses(db)

    return [
        {
            "id": analysis.id,
            "match_score": analysis.match_score,
            "missing_skills": analysis.missing_skills,
            "summary": analysis.summary,
            "created_at": analysis.created_at,
            "job_title": job.title if job else None,
            "job_company": job.company if job else None,
            "resume_name": (resume.parsed_json or {}).get("name") if resume else None,
            "resume_file_name": resume.file_name if resume else None
        }
        for analysis, job, resume in rows
    ]

@router.get("/{id}")
def get_history_item(
    id: str,
    db: Session = Depends(get_db)
):
    analysis = get_analysis_by_id(db, id)

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "job_id": analysis.job_id,
        "match_score": analysis.match_score,
        "missing_skills": analysis.missing_skills,
        "projects": analysis.projects,
        "summary": analysis.summary,
        "created_at": analysis.created_at
    }

@router.delete("/{id}")
def delete_history_item(id: str, db: Session = Depends(get_db)):
    deleted = delete_analysis_by_id(db, id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {"message": "Analysis deleted"}