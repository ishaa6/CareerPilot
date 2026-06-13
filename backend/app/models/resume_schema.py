from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional 

class Project(BaseModel):
    title: str 
    description: str 
    techStack: List[str] = Field(default_factory=list)

class Education(BaseModel):
    institution: str 
    score: float 
    year: str

class Experience(BaseModel):
    company: str 
    role: str 
    duration: str 
    description: str 

class ResumeData(BaseModel):
    name: str 

    email: Optional[EmailStr] = None 
    phone: Optional[str] = None 
    bio: Optional[str] = None 

    skills: List[str] = Field(default_factory=list)

    projects: List[Project] =  Field(default_factory=list)
    education: List[Education] =  Field(default_factory=list)
    experience: List[Experience] =  Field(default_factory=list)