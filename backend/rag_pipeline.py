from langchain_community.vectorstores import FAISS
from embeddings import get_embeddings_model
from langchain_core.documents import Document

_vector_store = None

def init_vector_store(documents: list[Document]):
    """Initializes the FAISS vector store with chunked documents."""
    global _vector_store
    embeddings = get_embeddings_model()
    _vector_store = FAISS.from_documents(documents, embeddings)
    print(f"Initialized FAISS vector store with {len(documents)} chunks.")

def retrieve_context(query: str, k: int = 5) -> str:
    """Retrieves relevant code chunks for a given query."""
    global _vector_store
    
    if not _vector_store:
        return ""
    
    docs = _vector_store.similarity_search(query, k=k)
    
    context = ""
    for idx, doc in enumerate(docs):
        source = doc.metadata.get('source', 'unknown')
        file_path = doc.metadata.get('file_path', 'unknown')
        context += f"\n--- Chunk {idx + 1} from {file_path} ({source}) ---\n"
        context += doc.page_content
        context += "\n"
        
    return context
