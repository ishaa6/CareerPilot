from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

from app.services.resume.pdf_parser import extract_text
from app.services.resume.resume_parser import parse_resume
from app.services.resume.add_resume import save_resume
from app.services.qdrant.resume_vectorizer import vectorize_resume
from app.services.resume.get_resume import (get_resume_by_id, get_all_resumes)
from app.services.resume.delete_resume import delete_resume_by_id

from app.db.models import Resume
from app.db.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            400,
            "Only PDFs allowed"
        )

    content = await file.read()
    text = extract_text(content)

    if not text.strip():
        raise HTTPException(
            400,
            "No text extracted"
        )

    try:
        resume_data = parse_resume(text)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Resume parsing failed"
        )

    saved_resume = save_resume(db, file.filename, text, resume_data.model_dump())

    vectorize_resume(saved_resume.id, text)

    return {
        "message": f"Resume {saved_resume.id} uploaded successfully",
        "file": file.filename,
        "resume_id": saved_resume.id
    }

@router.get("/{id}")
def get_resume(
    id: str,
    db: Session = Depends(get_db)
):
    resume = get_resume_by_id(db, id)

    if not resume:
        raise HTTPException(
            status_code = 404,
            details = "Resume not found"
        )
    
    return {
        "id": resume.id, 
        "parsed_json": resume.parsed_json
    }

@router.get("/")
def list_resumes(
    db = Depends(get_db)
):

    resumes = get_all_resumes(db)

    return [
        {
            "id": resume.id,
            "name": (
                resume.parsed_json.get("name")
                if resume.parsed_json
                else "Unknown"
            ),
            
        }
        for resume in resumes
    ]

@router.delete("/{id}")
def delete_resume(id: str, db: Session = Depends(get_db)):
    deleted = delete_resume_by_id(db, id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {"message": "Resume deleted"}
