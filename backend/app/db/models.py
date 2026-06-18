from sqlalchemy import Column, String, Text, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base
import uuid 

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    raw_text = Column(Text)
    parsed_json = Column(JSONB)

class JobDescription(Base):
    __tablename__ = "job_desc"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    company = Column(String)
    description = Column(Text)

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String)
    job_id = Column(String)
    match_score = Column(Integer)
    missing_skills = Column(JSONB)
    projects = Column(JSONB)
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
