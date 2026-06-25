from sentence_transformers import SentenceTransformer

model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("BAAI/bge-small-en-v1.5")
    
    return model

def embed_text(text: str):
    return model.encode(text).tolist()

VECTOR_SIZE = 384


