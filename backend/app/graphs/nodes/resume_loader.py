from app.services.resume.get_resume import get_resume_by_id
from app.db.database import SessionLocal

def load_resume(state):

    db = SessionLocal()

    try:
        resume = get_resume_by_id(
            db,
            state["resume_id"]
        )

        return {
            "resume_data": resume.parsed_json
        }

    finally:
        db.close()