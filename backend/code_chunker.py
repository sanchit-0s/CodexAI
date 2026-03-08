from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def chunk_code(documents: list) -> list[Document]:
    """Splits source code documents into smaller logical chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    
    langchain_docs = []
    for doc in documents:
        page_content = doc["page_content"]
        metadata = doc.get("metadata", {})
        
        lc_doc = Document(page_content=page_content, metadata=metadata)
        langchain_docs.append(lc_doc)
        
    split_docs = text_splitter.split_documents(langchain_docs)
    print(f"Split {len(documents)} files into {len(split_docs)} chunks.")
    
    return split_docs

def chunk_text(text: str, source: str = "direct_input") -> list[Document]:
    """Splits a single raw text string into chunks."""
    doc = {"page_content": text, "metadata": {"source": source}}
    return chunk_code([doc])
