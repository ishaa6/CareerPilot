from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base
import uuid 

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    raw_text = Column(Text)
    parsed_json = Column(JSONB)