from app.agents.jd_matcher import match_resmue_jd
from app.services.qdrant.qdrant_retrieve import retrieve_resume_chunks

def jd_matcher(state):

    chunks = retrieve_resume_chunks(
        state["resume_id"],
        state["job_data"]["description"]
    )

    resume_context = "\n\n".join(chunks)

    result = match_resmue_jd(
        resume_context,
        state["job_data"]
    )

    return {
        "match_result": result.model_dump()
    }