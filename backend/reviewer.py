import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

def get_llm():
    if "GEMINI_API_KEY" not in os.environ:
        print("WARNING: GEMINI_API_KEY environment variable is not set!")
        
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.2,
        max_output_tokens=2048
    )

def review_code_with_rag(query: str, context: str) -> str:
    """Uses Gemini API and retrieved context to code review or answer questions."""
    llm = get_llm()
    
    if not context:
        prompt_template = """
You are an expert Software Engineer and AI Code Reviewer.
The user has not provided any context or uploaded any code chunks. 
Answer their question as best as you can without context.

USER QUESTION:
{query}

EXPERT RESPONSE:
"""
    else:
        prompt_template = """
You are an expert Software Engineer and AI Code Reviewer. 
Review the code or answer the question based ONLY on the provided context (which contains chunks of source code).

If analyzing code, structure your response to include:
- Detected Bugs (if any)
- Code Quality Issues
- Performance Improvements
- Security Risks
- Suggested Improved Code
- Explanation of Functions

If the user is asking a general question about the codebase, use the context to answer it accurately.

CONTEXT FROM SOURCE CODE:
{context}

USER QUESTION / REQUEST:
{query}

EXPERT RESPONSE:
"""

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "query"] if context else ["query"])
    chain = prompt | llm
    
    inputs = {"query": query}
    if context:
        inputs["context"] = context
        
    response = chain.invoke(inputs)
    return response.content
