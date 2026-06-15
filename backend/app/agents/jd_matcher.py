from langchain_google_genai import ChatGoogleGenerativeAI

from app.models.job_schema import JDMatchResult

llm = ChatGoogleGenerativeAI(
    model='gemini-2.5-flash'
)

structured_llm = llm.with_structured_output(JDMatchResult)

def match_resmue_jd (
        resume_text: str,
        jd_text: str
):
    prompt = f"""
        Analyze the resume against the job description.

        Provide:
        - Overall match score
        - Strengths
        - Missing skills
        - Recommendations
        - Summary (2-3 sentences)

        Rules:
        - Use only information explicitly present in the inputs.
        - Do not infer or assume skills.
        - Only include a skill in missing_skills if it is required by the job description and clearly absent from the resume.
        - Return concise skill names, not sentences.
        Examples: Kafka, Redis, REST APIs, Distributed Systems, Docker.
        - Prioritize required skills over preferred skills when calculating match_score.
        - Keep all responses concise.

        Resume:
        {resume_text}

        Job Description:
        {jd_text}
    """

    return structured_llm.invoke(prompt)