from qdrant_client.models import PointStruct

from app.services.qdrant.qdrant_service import client

def store_chunks(
        resume_id: str,
        chunks: list[str],
        embeddings: list[list[float]]
):
    
    points = []

    for idx, (chunk, vector) in enumerate(
        zip(chunks, embeddings)
    ):
        points.append(
            PointStruct(
                id=f"{resume_id}_{idx}",
                vector=vector,
                payload={
                    "resume_id": resume_id,
                    "chunk_ind": idx,
                    "text": chunk
                }
            )
        )

    client.upsert(
        collection_name = "resumes",
        points = points
    )