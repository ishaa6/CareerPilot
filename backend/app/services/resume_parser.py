from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from app.models.resume_schema import ResumeData
from dotenv import load_dotenv
import os

load_dotenv()

#LLMs

gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)

# groq_llm = ChatGroq(
#     model="llama-3.3-70b-versatile",
#     temperature=0
# )

gemini_parser = gemini_llm.with_structured_output(
    ResumeData
)

# groq_parser = groq_llm.with_structured_output(
#     ResumeData
# )

def parse_resume(text):
    prompt = f"""
        Extract resume information into the provided schema.

        Do not invent information.
        Use null or empty lists for missing fields.
        
        Resume: 
        {text}
    """

    try:
        return gemini_parser.invoke(prompt)

    except Exception:
        # return groq_parser.invoke(prompt)
        print(f"""
            *********
            API ERROR
            *********
        """)
        return ""