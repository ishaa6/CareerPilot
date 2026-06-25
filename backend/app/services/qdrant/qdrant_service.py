from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.services.qdrant.embeddings import VECTOR_SIZE
import os

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

def create_resume_collection():
    client.create_collection(
        collection_name="resumes",
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE
        )
    )

# if client.collection_exists("resumes"):
#     client.delete_collection(
#         collection_name="resumes"
#     )

# create_resume_collection() 