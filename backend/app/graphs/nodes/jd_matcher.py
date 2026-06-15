from app.agents.jd_matcher import match_resmue_jd

def jd_matcher(state):

    result = match_resmue_jd(
        state["resume_data"],
        state["job_data"]
    )

    return {
        "match_result": result.model_dump()
    }