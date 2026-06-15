from app.services.job.get_job import get_job_by_id
from app.db.database import SessionLocal

def load_job(state):

    db = SessionLocal()

    try:
        job = get_job_by_id(
            db,
            state["job_id"]
        )

        return {
            "job_data": {
                "title": job.title,
                "company": job.company,
                "description": job.description
            }
        }

    finally:
        db.close()

