import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini client — just one API key, that's it
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.5-flash"


async def generate_answer_with_context(query: str, context_data: dict, chat_history: list = None, extracted_data: dict = None):
    """
    Uses Gemini 2.5 Flash to generate the final answer using Neo4j context.
    """
    if chat_history is None:
        chat_history = []
    if extracted_data is None:
        extracted_data = {}
        
    clauses = context_data.get("clauses", [])
    
    # Build citations and micro-graph from retrieved clauses
    citations = []
    nodes = [{"id": "User_Query", "label": query, "type": "query"}]
    edges = []
    
    context_text = ""
    for idx, c in enumerate(clauses):
        clean_id = str(c["id"]).replace(" ", "_")
        citations.append({
            "id": c["id"],
            "text": f"... {c['text'][:100]} ...",
            "relevance": "High Match" if idx == 0 else "Medium Match"
        })
        nodes.append({"id": clean_id, "label": c["id"], "type": "clause"})
        edges.append({"source": "User_Query", "target": clean_id, "label": "cites"})
        context_text += f"[{c['id']}] {c['text']}\n"
        
    answer = "Based on the retrieved policy context, there is insufficient data to answer fully."
    confidence = 0.5
    
    if len(clauses) > 0:
        confidence = 0.85

    try:
        history_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
        
        system_prompt = f"""You are the PolicyMe Enterprise Claims AI Assistant.
Process the user's input and extract claim details.

Current extracted data: {json.dumps(extracted_data)}

If claimType is missing, ask what happened. (Categories: auto-collision, auto-comprehensive, property, health)
If date/location is missing, ask when and where it occurred.
If amount is missing, ask for an estimated cost.
If all are present, summarize and state you are ready to file the claim.

You MUST output a JSON object with two keys:
"response": "your conversational response to the user"
"extracted_data": {{ updated extracted fields }}

Use the context if relevant:
{context_text}
"""
        
        user_message = f"History:\n{history_str}\n\nUser: {query}"
        
        print(f"Querying Gemini ({MODEL})...")
        response = client.models.generate_content(
            model=MODEL,
            contents=[user_message],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        content = response.text
        print(f"Gemini Response: {content}")
        
        try:
            parsed = json.loads(content)
            answer = parsed.get("response", answer)
            extracted_data.update(parsed.get("extracted_data", {}))
        except json.JSONDecodeError:
            answer = content
        
    except Exception as e:
        print(f"Gemini Error, using fallback: {e}")
        print("Ensure GEMINI_API_KEY is set correctly in .env")

    return {
        "answer": answer,
        "citations": citations,
        "microGraph": {
            "nodes": nodes,
            "edges": edges
        },
        "confidence": confidence,
        "extracted_data": extracted_data
    }


RISK_ASSESSMENT_PROMPT = """
CUSTOMER APPLICATION: {customer_data}

ANALYZE RISK FACTORS:
1. Age, driving history, vehicle age
2. Compare against institutional guidelines
3. Return JSON: {{"risk_score": <number 0-100>, "factors": ["list of strings"], "recommend": "approve" | "reject"}}

Be conservative. Enterprise underwriting requires precision.
"""

async def evaluate_underwriting_risk(customer_data: dict) -> dict:
    """
    Evaluates underwriting risk using Gemini 2.5 Flash.
    """
    default_response = {
        "risk_score": 50,
        "factors": ["Insufficient data processed"],
        "recommend": "reject",
        "is_mock": True
    }
    
    try:
        prompt_text = RISK_ASSESSMENT_PROMPT.format(customer_data=json.dumps(customer_data))
        
        print(f"Evaluating underwriting risk with Gemini ({MODEL})...")
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt_text],
            config=types.GenerateContentConfig(
                system_instruction="You are a senior insurance underwriter. You output strict JSON only.",
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        parsed = json.loads(response.text)
        
        return {
            "risk_score": parsed.get("risk_score", 50),
            "factors": parsed.get("factors", ["Unknown factors"]),
            "recommend": parsed.get("recommend", "reject").lower()
        }
        
    except Exception as e:
        print(f"Error evaluating risk: {e}")
        return default_response
