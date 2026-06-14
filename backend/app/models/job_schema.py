from pydantic import BaseModel
from typing import List

class JobCreate(BaseModel):
    title: str 
    company: str
    description: str 

class JDMatchResult(BaseModel):
    match_score: int 
    strengths: List[str]
    missing_skills: List[str]
    reccomendations: List[str]
    summary: str 

    