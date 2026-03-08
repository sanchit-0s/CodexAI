from langchain_community.embeddings import HuggingFaceEmbeddings

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

def get_embeddings_model():
    """Initializes and returns the HuggingFace embeddings model."""
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
