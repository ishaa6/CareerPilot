from typing import TypedDict

class GraphState(TypedDict):

    resume_id: str 
    job_id: str 

    resume_data: dict
    job_data: dict

    match_result: dict

    projects: list[dict]