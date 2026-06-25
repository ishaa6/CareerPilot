<<<<<<< Updated upstream
from fastapi import APIRouter
=======
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
>>>>>>> Stashed changes

from app.graphs.workflow import graph

router = APIRouter()

@router.post("/")
def analyze(
    resume_id: str,
    job_id: str
):
<<<<<<< Updated upstream
    
    result = graph.invoke(
        {
            "resume_id": resume_id,
            "job_id": job_id
        }
    )
=======
    try:    
        result = graph.invoke(
            {
                "resume_id": resume_id,
                "job_id": job_id
            }
        )
    except Exception as e:
        print("Exception: ", e)
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")

    try:
        save_analysis(db, resume_id, job_id, result)
    except Exception as e:
        print(f"Could not persist analysis: {e}")
>>>>>>> Stashed changes

    return {
        "match_score": result["match_result"]["match_score"],
        "missing_skills": result["match_result"]["missing_skills"],
        "projects": result["projects"],
        "summary": result["match_result"]["summary"]
    }