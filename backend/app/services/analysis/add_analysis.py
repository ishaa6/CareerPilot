from app.db.models import AnalysisHistory

def save_analysis(
    db,
    resume_id,
    job_id,
    result
):
    record = AnalysisHistory(
        resume_id=resume_id,
        job_id=job_id,
        match_score=result["match_result"]["match_score"],
        missing_skills=result["match_result"]["missing_skills"],
        projects=result["projects"],
        summary=result["match_result"]["summary"]
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record
