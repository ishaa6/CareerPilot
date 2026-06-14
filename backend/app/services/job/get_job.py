from app.db.models import JobDescription

def get_job_by_id(
        db,
        job_id
):
    return (
        db.query(JobDescription)
        .filter(
            JobDescription.id == job_id
        )
        .first()
    )