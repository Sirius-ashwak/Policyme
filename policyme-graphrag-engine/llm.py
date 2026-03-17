import os
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

import json

load_dotenv()

# Configure Ollama Client pointing to the default local port
local_llm = ChatOllama(
    model="llama3.2:1b",
    base_url="http://localhost:11434",
    temperature=0.1
)

async def generate_answer_with_context(query: str, context_data: dict, chat_history: list = None, extracted_data: dict = None):
    """
    Uses GPT-4 (or mock fallback) to generate the final answer 
    using the Neo4j context.
    """
    if chat_history is None:
        chat_history = []
    if extracted_data is None:
        extracted_data = {}
        
    clauses = context_data.get("clauses", [])
    
    # Constructing a dynamic mock response based on the retrieved clauses
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

    # In a full production env with API keys or Local LLM: 
    if local_llm:
        try:
            # We explicitly send this to the Local Ollama Model
            history_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
            
            system_prompt = f"""You are the PolicyMe Enterprise Claims AI Assistant.
            Process the user's input and extract claim details.
            
            Current extracted data: {json.dumps(extracted_data)}
            
            If claimType is missing, ask what happened. (Categories: auto-collision, auto-comprehensive, property, health)
            If date/location is missing, ask when and where it occurred.
            If amount is missing, ask for an estimated cost.
            If all are present, summarize and state you are ready to file the claim.

            Output MUST be structured as a JSON object with two keys:
            "response": "your conversational response to the user"
            "extracted_data": {{ updated extracted fields }}
            
            Use the context if relevant:
            {context_text}
            """
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"History:\n{history_str}\n\nUser: {query}")
            ]
            
            # Invoke the local model
            print("Querying Local Ollama Model (llama3.2:1b)...")
            ai_response = await local_llm.ainvoke(messages)
            content = ai_response.content
            print(f"Ollama Response: {content}")
            
            # Try to parse JSON from the response
            try:
                # Find JSON block if wrapped in markdown
                if "```json" in content:
                    json_str = content.split("```json")[1].split("```")[0]
                elif "```" in content:
                    json_str = content.split("```")[1].split("```")[0]
                else:
                    json_str = content
                    
                parsed = json.loads(json_str.strip())
                answer = parsed.get("response", answer)
                extracted_data.update(parsed.get("extracted_data", {}))
            except json.JSONDecodeError:
                # Fallback if LLM failed to return pure JSON
                answer = content
            
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
        "confidence": confidence,
        "extracted_data": extracted_data
    }
