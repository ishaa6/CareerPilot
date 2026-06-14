from app.services.qdrant.chunker import chunk_text
from app.services.qdrant.embeddings import embed_text
from app.services.qdrant.qdrant_store import store_chunks

def vectorize_resume(
        resume_id: str,
        text: str
):
    chunks = chunk_text(text)

    embeddings = [
        embed_text(chunk)
        for chunk in chunks
    ]

    store_chunks(
        resume_id=resume_id,
        chunks=chunks,
        embeddings=embeddings
    )