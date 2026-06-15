from fastapi import APIRouter

from app.graphs.workflow import graph

router = APIRouter()

@router.post("/")
def analyze(
    resume_id: str,
    job_id: str
):
    
    result = graph.invoke(
        {
            "resume_id": resume_id,
            "job_id": job_id
        }
    )

    return {
        "match_score": result["match_result"]["match_score"],
        "missing_skills": result["match_result"]["missing_skills"],
        "projects": result["projects"],
        "summary": result["match_result"]["summary"]
    }