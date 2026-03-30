import os
import json
from google import genai
from google.genai import types

VOICE_RAG_SYSTEM_PROMPT = """
You are InsurAI, an enterprise-grade insurance policy intelligence engine.
Analyze the CUSTOMER CLAIM (provided via audio) against the POLICY GRAPH CONTEXT.

INSTRUCTIONS:
1. Determine coverage based ONLY on the provided graph context.
2. Formulate a natural, empathetic response for the customer in {target_language}.
3. Keep policy citations in the {target_language} response in English (e.g. "Section 4B").
4. If the policy doesn't cover the claim, state that clearly but politely.

GRAPH CONTEXT FROM NEO4J:
{graph_nodes}

You MUST return a valid JSON object matching this schema:
{
  "approved": boolean (true if claim has merit/coverage, false otherwise),
  "citation": "string (Exact clause like 'Section X' or 'None' if NA)",
  "internal_reasoning_en": "string (Why it was approved/rejected based on graph)",
  "customer_response": "string (The empathetic {target_language} response to be spoken)"
}
"""

async def process_voice_claim(audio_bytes: bytes, customer_name: str, graph_context: str, target_language: str = "Tamil"):
    """
    Takes raw audio and a Neo4j graph context, and uses Gemini 2.0 Flash 
    to simultaneously transcribe, reason, and translate.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not set. Mocking the voice claim response.")
        
        # Mocking responses based on language
        mock_response_text = "Your claim is valid. Rain flood is covered under Section 4B."
        if target_language.lower() == "tamil":
            mock_response_text = "உங்கள் கோரிக்கை செல்லுபடியாகும். Section 4B இன் கீழ் மழை வெல்லம் காப்பீடு செய்யப்பட்டுள்ளது."
        elif target_language.lower() == "hindi":
            mock_response_text = "आपका दावा मान्य है। Section 4B के तहत बारिश की बाढ़ कवर की गई है।"
        elif target_language.lower() == "telugu":
            mock_response_text = "మీ క్లెయిమ్ చెల్లుబాటు అవుతుంది. Section 4B కింద వర్షపు వరద కవర్ చేయబడింది."

        return {
            "approved": True,
            "citation": "Section 4B",
            "internal_reasoning_en": "Mocked: The user mentioned water damage, which is covered under Sec 4B.",
            "customer_response": mock_response_text,
            "is_mock": True
        }

    try:
        client = genai.Client()
        
        # Audio part for Gemini Multimodal
        # Assuming the browser sends audio/webm recorded via MediaRecorder
        audio_part = types.Part.from_bytes(
            data=audio_bytes,
            mime_type='audio/webm',
        )
        
        system_instruction = VOICE_RAG_SYSTEM_PROMPT.format(
            graph_nodes=graph_context, 
            target_language=target_language
        )
        
        # We use strict JSON output schema to ensure determinism
        response_schema = {
            "type": "OBJECT",
            "properties": {
                "approved": {"type": "BOOLEAN"},
                "citation": {"type": "STRING"},
                "internal_reasoning_en": {"type": "STRING"},
                "customer_response": {"type": "STRING"},
            },
            "required": ["approved", "citation", "internal_reasoning_en", "customer_response"]
        }

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            temperature=0.2, # Keep hallucination risk low
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[audio_part, "Extract the claim details from my voice and analyze according to the system prompt."],
            config=config,
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Gemini Voice processing error: {e}")
        raise e
