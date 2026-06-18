from app.db.models import AnalysisHistory, JobDescription, Resume

def list_analyses(
    db,
    limit: int = 50
):
    return (
        db.query(AnalysisHistory, JobDescription, Resume)
        .outerjoin(JobDescription, JobDescription.id == AnalysisHistory.job_id)
        .outerjoin(Resume, Resume.id == AnalysisHistory.resume_id)
        .order_by(AnalysisHistory.created_at.desc())
        .limit(limit)
        .all()
    )

def get_analysis_by_id(
    db,
    analysis_id
):
    return (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.id == analysis_id)
        .first()
    )
