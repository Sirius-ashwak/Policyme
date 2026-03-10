import os
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

# Configure Ollama Client pointing to the default local port
local_llm = ChatOllama(
    model="llama3.2:1b",
    base_url="http://localhost:11434",
    temperature=0.1
)

async def generate_answer_with_context(query: str, context_data: dict):
    """
    Uses GPT-4 (or mock fallback) to generate the final answer 
    using the Neo4j context.
    """
    clauses = context_data.get("clauses", [])
    
    # Constructing a dynamic mock response based on the retrieved clauses
    citations = []
    nodes = [{"id": "User_Query", "label": query, "type": "query"}]
    edges = []
    
    context_text = ""
    for idx, c in enumerate(clauses):
        clean_id = c["id"].replace(" ", "_")
        citations.append({
            "id": c["id"],
            "text": f"... {c['text']} ...",
            "relevance": "High Match" if idx == 0 else "Medium Match"
        })
        nodes.append({"id": clean_id, "label": c["id"], "type": "clause"})
        edges.append({"source": "User_Query", "target": clean_id, "label": "cites"})
        
        context_text += f"[{c['id']}] {c['text']}\n"
        
    answer = "Based on the retrieved policy context, there is insufficient data to answer fully."
    confidence = 0.5

    # Mock dynamic answer logic based on keywords
    q_lower = query.lower()
    if "remote" in q_lower:
        answer = f"According to the retrieved context, remote work is permitted up to 3 days per week (HR Policy § 3.2). Please ensure you are connected to the company VPN while working remotely (Security § 4.1)."
        confidence = 0.94
    elif "windshield" in q_lower:
        answer = f"There is a policy conflict regarding windshields. Auto Policy § 7 states no deductible is required, but Auto Policy § 12 states a $500 deductible applies. Escalating to human underwriter."
        confidence = 0.65
    elif len(clauses) > 0:
        answer = f"According to {clauses[0]['id']}, the policy states: {clauses[0]['text']}."
        confidence = 0.88

    # In a full production env with API keys or Local LLM: 
    if local_llm:
        try:
            # We explicitly send this to the Local Ollama Model
            messages = [
                SystemMessage(content="You are the PolicyMe Enterprise Claims AI. Answer the user's query strict and concisely using ONLY the provided context text. If the context does not contain the answer, state that you cannot determine the outcome."),
                HumanMessage(content=f"Context:\n{context_text}\n\nQuery: {query}")
            ]
            
            # Invoke the local model
            print("Querying Local Ollama Model (llama3.2:1b)...")
            ai_response = await local_llm.ainvoke(messages)
            
            # Override our mock answers with real local AI generation
            answer = ai_response.content
            print(f"Ollama Response: {answer}")
            
        except Exception as local_err:
            print(f"Ollama Local Inference Error, falling back to mock: {local_err}")
            print("Ensure that Ollama is running locally and the model `llama3.2:1b` is downloaded.")

    return {
        "answer": answer,
        "citations": citations,
        "microGraph": {
            "nodes": nodes,
            "edges": edges
        },
        "confidence": confidence
    }
