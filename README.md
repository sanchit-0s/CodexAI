# CodexAI - RAG AI Code Reviewer

An advanced Generative AI system that demonstrates **Retrieval Augmented Generation (RAG)** and **AI-based code review**. CodexAI helps developers review code, find bugs, improve code quality, and explain functions through a conversational AI interface.

## 🚀 Features

- **Code Input Options**: Paste code snippets directly, upload files (`.py`, `.js`, `.ts`, etc.), or provide a public GitHub repository URL to index an entire codebase.
- **RAG-Powered AI Reviews**: Asks Gemini AI to provide structured code reviews (Bugs, Quality, Performance, Security) based *only* on the context of your provided code.
- **Chat History**: Automatically saves review sessions to a local SQLite database, displayed in the sidebar for easy access.
- **Sleek UI**: A premium, responsive dark-mode interface built with Next.js and Vanilla CSS.

## 🏗️ Architecture & Concepts

### Retrieval Augmented Generation (RAG)
RAG is an AI framework that improves the quality of LLM responses by grounding the model on custom, external sources of knowledge. Instead of asking Gemini to guess about your codebase, CodexAI first *retrieves* relevant chunks of your code, and passes them as *context* to the LLM, ensuring the review is highly accurate and tailored to your specific application.

### How Under-the-Hood Components Work
- **Code Chunker** (LangChain): Large source code files cannot fit into an LLM's prompt all at once. CodexAI uses `RecursiveCharacterTextSplitter` to intelligently divide your code into smaller, logical chunks (e.g., 1000 characters with 200 character overlap).
- **Embeddings** (`sentence-transformers`): Converts the text chunks into dense multidimensional vectors (embeddings). Neural networks understand the meaning of the code through these numerical representations. CodexAI uses `all-MiniLM-L6-v2`, a fast and efficient embedding model.
- **Vector Database** (FAISS): FAISS (Facebook AI Similarity Search) acts as the storage engine for our text chunks' embeddings. When you ask a question, your question is also turned into an embedding, and FAISS instantly retrieves the top 5 most similar (relevant) code chunks.
- **LLM Integration** (LangChain + Gemini): LangChain orchestrates the flow. It takes the user's question, fetches the relevant chunks from FAISS, dynamically constructs a prompt containing this context, and sends it to the Gemini API to generate the final structured review.
- **Database** (SQLite): A lightweight local database that automatically creates a `chat_history.db` to permanently store your interaction sessions.

## 💻 Tech Stack

**Frontend:** Next.js (TypeScript), Vanilla CSS
**Backend:** Python FastAPI, LangChain, `sentence-transformers`, FAISS, Google Gemini API
**Database:** SQLite

## ⚙️ Setup & Installation

Follow these steps to run CodexAI locally.

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- A Google Gemini API Key. Get one for free at [Google AI Studio](https://aistudio.google.com/).

### 2. Backend Setup
Run the following in your terminal:
```bash
cd backend
python -m venv venv

# Activate venv on Windows:
venv\Scripts\activate
# Activate venv on macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# IMPORTANT: Set your API Key
# Windows CMD: set GEMINI_API_KEY="your-api-key"
# Windows PowerShell: $env:GEMINI_API_KEY="your-api-key"
# Mac/Linux: export GEMINI_API_KEY="your-api-key"

# Start the server!
uvicorn main:app --reload
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Usage
Open your browser at `http://localhost:3000`. 
1. Supply a GitHub Repo URL or paste some code snippets. Context will be chunked and indexed. 
2. Wait a moment for indexing.
3. Type a question or say "Review my code" in the chat panel.
4. Receive a beautifully structured RAG-powered AI review!
