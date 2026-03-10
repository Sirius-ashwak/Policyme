from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from database import search_neo4j_graph
from llm import generate_answer_with_context
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PolicyMe GraphRAG Engine")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"], # Allow frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    userId: str

class Citation(BaseModel):
    id: str
    text: str
    relevance: str

class GraphData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class QueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    microGraph: GraphData
    confidence: float

@app.post("/graphrag/query", response_model=QueryResponse)
async def process_graphrag_query(request: QueryRequest):
    try:
        # Step 1: Query Neo4j Graph for relevant clauses and multi-hop context
        context_data = await search_neo4j_graph(request.query)
        
        # Step 2: Generate response using OpenAI GPT-4 with retrieved context
        result = await generate_answer_with_context(request.query, context_data)
        
        return QueryResponse(
            answer=result["answer"],
            citations=result["citations"],
            microGraph=result["microGraph"],
            confidence=result["confidence"]
        )
    except Exception as e:
        print(f"GraphRAG Query Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
