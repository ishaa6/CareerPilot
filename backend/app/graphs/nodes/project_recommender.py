from app.agents.project_recommender import recommend_projects

def project_recommender(state):

    try:
        result = recommend_projects(
            state["match_result"]["missing_skills"]
        )

        print("PROJECT RECCOS:")
        print(result.projects)

        return {
            "projects": [
                project.model_dump()
                for project in result.projects
            ]
        }
    
    except Exception:
        return {
            "projects": []
        }