from app.db.models import Resume

def save_resume(
        db,
        file_name,
        raw_text,
        parsed_json
):
    resume = Resume(
        file_name = file_name,
        raw_text = raw_text,
        parsed_json = parsed_json
    )

    db.add(resume)
    db.commit()

    return resume