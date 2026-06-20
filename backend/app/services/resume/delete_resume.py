from app.db.models import Resume

def delete_resume_by_id(db, resume_id):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        return False
    
    db.delete(resume)
    db.commit()

    return True