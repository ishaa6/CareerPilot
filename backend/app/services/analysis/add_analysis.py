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
        match_score=result["match_score"],
        missing_skills=result["missing_skills"],
        projects=result["projects"],
        summary=result["summary"]
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record
