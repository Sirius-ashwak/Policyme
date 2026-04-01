from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from database import search_neo4j_graph, get_macro_graph, get_customer_policy_graph
from llm import generate_answer_with_context, evaluate_underwriting_risk
from gemini_voice import process_voice_claim
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

PRODUCTION_ENVS = {"staging", "prod", "production"}


def parse_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def parse_csv(value: str) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


APP_ENV = os.getenv("APP_ENV", "local").strip().lower()
STRICT_STARTUP = parse_bool(os.getenv("STRICT_STARTUP"), default=False)
ENABLE_MOCKS = parse_bool(os.getenv("ENABLE_MOCKS"), default=True)

default_origins = "http://localhost:3000,http://localhost:3001"
raw_allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    default_origins if APP_ENV == "local" else "",
)
ALLOWED_ORIGINS = parse_csv(raw_allowed_origins)
ALLOW_CREDENTIALS = parse_bool(os.getenv("CORS_ALLOW_CREDENTIALS"), default=True)


def validate_startup_config() -> None:
    errors = []
    enforce_strict = STRICT_STARTUP or APP_ENV in PRODUCTION_ENVS

    if "*" in ALLOWED_ORIGINS and ALLOW_CREDENTIALS:
        errors.append("ALLOWED_ORIGINS cannot contain '*' when CORS_ALLOW_CREDENTIALS=true.")

    if enforce_strict:
        if not os.getenv("GEMINI_API_KEY"):
            errors.append("GEMINI_API_KEY is required in strict or production mode.")

        missing_neo4j = [
            var_name
            for var_name in ("NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD")
            if not os.getenv(var_name)
        ]
        if missing_neo4j:
            errors.append(f"Missing required Neo4j env vars: {', '.join(missing_neo4j)}")

        if not ALLOWED_ORIGINS:
            errors.append("ALLOWED_ORIGINS must be set in strict or production mode.")

    if errors:
        raise RuntimeError("Startup validation failed: " + " ".join(errors))


validate_startup_config()

app = FastAPI(title="PolicyMe GraphRAG Engine — Gemini 2.5 Flash")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=ALLOW_CREDENTIALS,
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

# Initialize Gemini client for embeddings
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def get_embedding(text: str) -> List[float]:
    """Get embedding vector from Gemini text-embedding-004."""
    try:
        response = gemini_client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"Gemini Embedding Error: {e}")
        return []


@app.post("/graphrag/query", response_model=QueryResponse)
async def process_graphrag_query(request: QueryRequest):
    try:
        # Step 0: Embed query using Gemini
        query_embedding = await get_embedding(request.query)
        
        # Step 1: Query Neo4j Graph for relevant clauses
        context_data = await search_neo4j_graph(request.query)
        
        # Step 2: Generate response using Gemini 2.5 Flash
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
        audio_bytes = await audio.read()
        graph_context = await get_customer_policy_graph(customer_name)
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
        risk_assessment = await evaluate_underwriting_risk(request.customer_data)
        return risk_assessment
    except Exception as e:
        print(f"Error handling underwrite logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint to verify Gemini API connectivity."""
    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=["ping"],
            config={"max_output_tokens": 5},
        )
        return {
            "status": "healthy",
            "gemini": "connected",
            "model": "gemini-2.5-flash",
            "response": response.text,
            "app_env": APP_ENV,
            "strict_startup": STRICT_STARTUP,
            "mocks_allowed": APP_ENV == "local" and ENABLE_MOCKS,
            "allowed_origins": ALLOWED_ORIGINS,
        }
    except Exception as e:
        return {
            "status": "degraded",
            "gemini": f"error: {str(e)}",
            "app_env": APP_ENV,
            "strict_startup": STRICT_STARTUP,
            "mocks_allowed": APP_ENV == "local" and ENABLE_MOCKS,
            "allowed_origins": ALLOWED_ORIGINS,
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
