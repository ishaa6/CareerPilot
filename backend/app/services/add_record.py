from app.db.models import Resume

def save_resume(
        db,
        raw_text,
        parsed_json
):
    resume = Resume(
        raw_text = raw_text,
        parsed_json = parsed_json
    )

    db.add(resume)
    db.commit()