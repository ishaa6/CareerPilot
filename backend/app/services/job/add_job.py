from app.db.models import JobDescription

def save_job(
        db,
        job
):
    
    new_job = JobDescription(
        title=job.title,
        company=job.company,
        description=job.description
    )

    db.add(new_job)
    db.commit()

    return new_job