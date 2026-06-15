from pydantic import BaseModel
from typing import List

class ProjectSuggestion(BaseModel):
    title: str
    description: str
    skills: list[str]

class ProjectRecommendations(BaseModel):
    projects: List[ProjectSuggestion]