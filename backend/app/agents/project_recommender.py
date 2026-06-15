from langchain_google_genai import ChatGoogleGenerativeAI

from app.models.project_schema import (
    ProjectRecommendations
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)

structured_llm = llm.with_structured_output(
    ProjectRecommendations
)

def recommend_projects(
    missing_skills: list[str]
):
    prompt = f"""
    Suggest 3 portfolio projects that help
    demonstrate the following skills:

    {', '.join(missing_skills)}

    Projects should:
    - Be resume worthy
    - Be suitable for software engineering roles
    - Demonstrate the listed skills
    - Have clear business value
    """

    return structured_llm.invoke(prompt)