from app.db.models import JobDescription

def delete_job_by_id(db, job_id):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()

    if not job:
        return False
    
    db.delete(job)
    db.commit()

    return True