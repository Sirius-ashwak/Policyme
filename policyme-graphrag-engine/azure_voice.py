import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

# Azure OpenAI client (reuse from llm.py or initialize here)
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21"),
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o-mini")

VOICE_RAG_SYSTEM_PROMPT = """
You are InsurAI, an enterprise-grade insurance policy intelligence engine.
Analyze the CUSTOMER CLAIM (provided as transcribed text) against the POLICY GRAPH CONTEXT.

INSTRUCTIONS:
1. Determine coverage based ONLY on the provided graph context.
2. Cite EXACT clause numbers (e.g. "Section 4B", "Clause 12.3").
3. Determine if the claim has merit. NEVER hallucinate. If policy doesn't cover claim, say "Not covered".
4. Formulate a natural, empathetic response for the customer in {target_language}.
5. Keep policy citations in the {target_language} response in English (e.g. "Section 4B").

GRAPH CONTEXT FROM NEO4J:
{graph_nodes}

You MUST return a valid JSON object matching this schema:
{{
  "approved": boolean (true if claim has coverage based on graph context),
  "citation": "string (Exact clause like 'Section X' or 'Not covered')",
  "reason": "string (2 sentences maximum explaining why it was approved/rejected)",
  "customer_response": "string (The empathetic {target_language} response to be spoken)"
}}
"""


async def transcribe_audio_azure(audio_bytes: bytes) -> str:
    """
    Transcribes audio using Azure OpenAI Whisper model.
    Falls back to a simple description if Whisper is not deployed.
    """
    try:
        # Try using Azure OpenAI's whisper deployment
        # Note: You need to deploy a 'whisper' model in Azure OpenAI Studio for this
        import tempfile
        
        # Write bytes to a temporary file (Whisper API needs a file)
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name
        
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper",  # Deploy a 'whisper' model in Azure OpenAI Studio
                file=audio_file,
            )
        
        os.unlink(tmp_path)  # Clean up temp file
        return transcript.text
        
    except Exception as e:
        print(f"Azure Whisper transcription error: {e}")
        print("Falling back to mock transcription. Deploy a 'whisper' model in Azure OpenAI Studio for real transcription.")
        return "My house was damaged by heavy rain last night. Water entered through the roof and damaged furniture."


async def process_voice_claim(audio_bytes: bytes, customer_name: str, graph_context: str, target_language: str = "Tamil"):
    """
    Takes raw audio, transcribes with Azure Whisper, then uses Azure OpenAI GPT-4o-mini
    to analyze against Neo4j graph context and respond in the target language.
    """
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if not api_key:
        print("Warning: AZURE_OPENAI_API_KEY not set. Mocking the voice claim response.")
        
        # Mock responses based on language
        mock_response_text = "Your claim is valid. Rain flood is covered under Section 4B."
        if target_language.lower() == "tamil":
            mock_response_text = "உங்கள் கோரிக்கை செல்லுபடியாகும். Section 4B இன் கீழ் மழை வெல்லம் காப்பீடு செய்யப்பட்டுள்ளது."
        elif target_language.lower() == "hindi":
            mock_response_text = "आपका दावा मान्य है। Section 4B के तहत बारिश की बाढ़ कवर की गई है।"
        elif target_language.lower() == "telugu":
            mock_response_text = "మీ క్లెయిమ్ చెల్లుబాటు అవుతుంది. Section 4B కింద వర్షపు వరద కవర్ చేయబడింది."
        elif target_language.lower() == "kannada":
            mock_response_text = "ನಿಮ್ಮ ಕ್ಲೈಮ್ ಮಾನ್ಯವಾಗಿದೆ. Section 4B ಅಡಿಯಲ್ಲಿ ಮಳೆ ಪ್ರವಾಹ ಕವರ್ ಆಗಿದೆ."

        return {
            "approved": True,
            "citation": "Section 4B",
            "reason": "Mocked: The user mentioned water damage, which is covered under Sec 4B.",
            "customer_response": mock_response_text,
            "is_mock": True
        }

    try:
        # Step 1: Transcribe audio using Azure Whisper
        print("Step 1: Transcribing audio with Azure Whisper...")
        transcript = await transcribe_audio_azure(audio_bytes)
        print(f"Transcript: {transcript}")
        
        # Step 2: Analyze transcript against graph context using GPT-4o-mini
        print("Step 2: Analyzing with Azure OpenAI GPT-4o-mini...")
        
        system_instruction = VOICE_RAG_SYSTEM_PROMPT.format(
            graph_nodes=graph_context, 
            target_language=target_language
        )
        
        messages = [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Customer '{customer_name}' said: \"{transcript}\"\n\nAnalyze this claim against the policy graph context and respond in {target_language}."}
        ]
        
        response = client.chat.completions.create(
            model=DEPLOYMENT,
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"},
            max_tokens=1024,
        )
        
        content = response.choices[0].message.content
        print(f"Azure OpenAI Voice Claim Response: {content}")
        
        return json.loads(content)
        
    except Exception as e:
        print(f"Azure OpenAI Voice processing error: {e}")
        raise e
