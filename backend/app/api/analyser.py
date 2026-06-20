from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import time

from app.graphs.workflow import graph
from app.services.analysis.add_analysis import save_analysis
from app.db.database import get_db

router = APIRouter()

@router.post("/")
def analyze(
    resume_id: str,
    job_id: str,
    db: Session = Depends(get_db)
):
    
    request_start = time.time()

    print("=" * 50)
    print("ANALYSIS STARTED")
    print(f"Resume ID: {resume_id}")
    print(f"Job ID: {job_id}")

    graph_start = time.time()
    
    result = graph.invoke(
        {
            "resume_id": resume_id,
            "job_id": job_id
        }
    )

    print(
        f"Graph Execution: "
        f"{time.time() - graph_start:.2f}s"
    )

    save_start = time.time()

    save_analysis(db, resume_id, job_id, result)

    print(
        f"Save Analysis: "
        f"{time.time() - save_start:.2f}s"
    )

    print(
        f"TOTAL REQUEST: "
        f"{time.time() - request_start:.2f}s"
    )

    print("=" * 50)

    return {
        "match_score": result["match_result"]["match_score"],
        "missing_skills": result["match_result"]["missing_skills"],
        "projects": result["projects"],
        "summary": result["match_result"]["summary"]
    }