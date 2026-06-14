from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.services.qdrant.embeddings import VECTOR_SIZE

client = QdrantClient(
    url="http://localhost:6333"
)

def create_resume_collection():
    client.create_collection(
        collection_name="resumes",
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE
        )
    )

# create_resume_collection() - run once manually