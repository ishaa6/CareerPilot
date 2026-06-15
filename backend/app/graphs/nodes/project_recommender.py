from app.agents.project_recommender import recommend_projects

def project_recommender(state):

    result = recommend_projects(
        state["match_result"]["missing_skills"]
    )

    return {
        "projects": result.projects
    }