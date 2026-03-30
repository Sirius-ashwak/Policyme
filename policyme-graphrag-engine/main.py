from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from database import search_neo4j_graph, get_macro_graph, get_customer_policy_graph
from llm import generate_answer_with_context, evaluate_underwriting_risk
from gemini_voice import process_voice_claim
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
    chat_history: List[Dict[str, str]] = []
    extracted_data: Dict[str, Any] = {}

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
    extracted_data: Dict[str, Any] = {}

from langchain_ollama import OllamaEmbeddings

# Initialize the embedder once
embedder = OllamaEmbeddings(
    model="llama3.2:1b",
    base_url="http://localhost:11434"
)

@app.post("/graphrag/query", response_model=QueryResponse)
async def process_graphrag_query(request: QueryRequest):
    try:
        # Step 0: Embed query
        query_embedding = await embedder.aembed_query(request.query)
        
        # Step 1: Query Neo4j Graph for relevant clauses and multi-hop context
        context_data = await search_neo4j_graph(request.query)
        
        # Step 2: Generate response using OpenAI GPT-4 with retrieved context
        result = await generate_answer_with_context(
            request.query, 
            context_data, 
            request.chat_history, 
            request.extracted_data
        )
        
        return QueryResponse(
            answer=result["answer"],
            citations=result["citations"],
            microGraph=result["microGraph"],
            confidence=result["confidence"],
            extracted_data=result.get("extracted_data", request.extracted_data)
        )
    except Exception as e:
        print(f"GraphRAG Query Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/graphrag/macro_graph")
async def process_macro_graph_query():
    try:
        graph_data = await get_macro_graph()
        return graph_data
    except Exception as e:
        print(f"Macro Graph Query Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice-claim")
async def handle_voice_claim(
    audio: UploadFile = File(...),
    customer_name: str = Form(...),
    target_language: str = Form("Tamil")
):
    try:
        # Read raw bytes from incoming audio
        audio_bytes = await audio.read()
        
        # 1. Fetch policy graph context representing the clauses from auraDb (mocked)
        graph_context = await get_customer_policy_graph(customer_name)
        
        # 2. GraphRAG Analysis via Multimodal Gemini 2.0 Flash
        # Transcribes audio, retrieves clauses, and formats response in target language
        analysis_result = await process_voice_claim(audio_bytes, customer_name, graph_context, target_language)
        
        return analysis_result
        
    except Exception as e:
        print(f"Error handling voice claim: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class UnderwriteRequest(BaseModel):
    customer_data: Dict[str, Any]

@app.post("/api/underwrite")
async def handle_underwrite(request: UnderwriteRequest):
    try:
        # Run the local LLM to assess risk
        risk_assessment = await evaluate_underwriting_risk(request.customer_data)
        return risk_assessment
    except Exception as e:
        print(f"Error handling underwrite logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
