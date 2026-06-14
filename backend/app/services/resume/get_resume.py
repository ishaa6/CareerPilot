from app.db.models import Resume

def get_resume_by_id(
    db,
    resume_id
):
    return (
        db.query(Resume)
        .filter(
            Resume.id == resume_id
        )
        .first()
    )