from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

from database import init_db, save_session, get_all_sessions
from repo_loader import clone_and_load_repo
from code_chunker import chunk_code, chunk_text
from rag_pipeline import init_vector_store, retrieve_context
from reviewer import review_code_with_rag

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = FastAPI(title="CodexAI - RAG AI Code Reviewer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    url: str

class CodeRequest(BaseModel):
    code: str

class ReviewRequest(BaseModel):
    question: str

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/analyze-repo")
def analyze_repo(req: RepoRequest):
    try:
        documents = clone_and_load_repo(req.url)
        if not documents:
            raise HTTPException(status_code=400, detail="No code files found in repository.")
            
        chunks = chunk_code(documents)
        init_vector_store(chunks)
        return {"status": "success", "message": f"Successfully loaded and indexed {len(chunks)} chunks from repo."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-code")
def upload_code(req: CodeRequest):
    try:
        if not req.code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty.")
            
        chunks = chunk_text(req.code)
        init_vector_store(chunks)
        return {"status": "success", "message": f"Successfully loaded and indexed code snippet."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask-review")
def ask_review(req: ReviewRequest):
    try:
        context = retrieve_context(req.question, k=5)
        review_response = review_code_with_rag(req.question, context)
        save_session(req.question, review_response)
        
        return {"response": review_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history():
    try:
        return {"history": get_all_sessions()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
