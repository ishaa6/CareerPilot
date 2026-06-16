from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.services.qdrant.qdrant_service import client
from app.services.qdrant.embeddings import embed_text


def retrieve_resume_chunks(
    resume_id: str,
    jd_text: str,
    limit: int = 10
):
    print("JD")
    print(jd_text)
    
    query_vector = embed_text(jd_text)

    results = client.query_points(
        collection_name="resumes",
        query=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="resume_id",
                    match=MatchValue(
                        value=resume_id
                    )
                )
            ]
        ),
        limit=limit
    )

    return [
        point.payload["text"]
        for point in results.points
    ]