"""
Kafka Consumer for PolicyMe GraphRAG Engine.
Listens for DocumentEvent messages published by the Java Spring Boot Ingestion API.
When a new document is uploaded, this consumer picks it up and triggers
Neo4j graph ingestion.

Run this separately alongside the FastAPI server:
    python kafka_consumer.py
"""

import asyncio
import json
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "policyme.document.uploaded")
KAFKA_GROUP_ID = os.getenv("KAFKA_GROUP_ID", "graphrag-consumer-group")

# Try importing the kafka library; if not available, use a mock consumer
try:
    from aiokafka import AIOKafkaConsumer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False
    logger.warning("⚠️ aiokafka not installed. Running in MOCK consumer mode.")


from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from database import insert_document_and_chunks

embedder = OllamaEmbeddings(
    model="llama3.2:1b",
    base_url="http://localhost:11434"
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
    is_separator_regex=False,
)

async def process_document_event(event_data: dict):
    """
    Process a DocumentEvent received from Kafka.
    1. Reads extracted text (mocking S3 download).
    2. Chunks the text.
    3. Generates embeddings using Ollama.
    4. Inserts into Neo4j.
    """
    doc_id = event_data.get("documentId", "unknown")
    filename = event_data.get("originalFilename", "unknown")
    extracted_text = event_data.get("extractedText", "")
    
    logger.info(f"📥 Processing document: {doc_id} ({filename})")
    logger.info(f"   📄 Extracted text length: {len(extracted_text)} characters")
    
    # 1. Chunking 
    chunks = text_splitter.split_text(extracted_text)
    logger.info(f"   🔪 Split into {len(chunks)} chunks for graph ingestion")
    
    chunk_data_list = []
    
    for i, chunk_text in enumerate(chunks):
        logger.info(f"   📊 Generating embedding for Chunk {i+1}/{len(chunks)}: {len(chunk_text)} chars")
        # 2. Embedding
        try:
            embedding = await embedder.aembed_query(chunk_text)
            chunk_data_list.append({
                "chunk_id": f"{doc_id}-chunk-{i}",
                "text": chunk_text,
                "embedding": embedding,
                "index": i
            })
        except Exception as e:
            logger.error(f"Error generating embedding for chunk: {e}")
            
    # 3. Neo4j Insertion
    if chunk_data_list:
        logger.info(f"   💾 Inserting document and {len(chunk_data_list)} chunks into Neo4j...")
        await insert_document_and_chunks(doc_id, filename, chunk_data_list)
        logger.info(f"✅ Document {doc_id} processed successfully.")
    else:
         logger.warning(f"⚠️ Document {doc_id} yielded no chunks.")


async def run_kafka_consumer():
    """
    Main Kafka consumer loop.
    Continuously listens for DocumentEvent messages from the Spring Boot API.
    """
    if not KAFKA_AVAILABLE:
        logger.info("🔄 [MOCK MODE] Kafka consumer running in simulation mode.")
        logger.info(f"   Would connect to: {KAFKA_BOOTSTRAP_SERVERS}")
        logger.info(f"   Would subscribe to topic: {KAFKA_TOPIC}")
        logger.info(f"   Group ID: {KAFKA_GROUP_ID}")
        logger.info("   Waiting for messages... (install aiokafka for real Kafka consumption)")
        
        # Keep the process alive
        while True:
            await asyncio.sleep(30)
            logger.info("🔄 [MOCK] Still listening for Kafka events...")
        return

    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=KAFKA_GROUP_ID,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest"
    )

    await consumer.start()
    logger.info(f"✅ Kafka Consumer started. Listening on topic: {KAFKA_TOPIC}")

    try:
        async for msg in consumer:
            logger.info(f"📨 Received message from partition {msg.partition}, offset {msg.offset}")
            event_data = msg.value
            await process_document_event(event_data)
    finally:
        await consumer.stop()
        logger.info("🛑 Kafka Consumer stopped.")


if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("PolicyMe GraphRAG — Kafka Document Consumer")
    logger.info(f"Broker: {KAFKA_BOOTSTRAP_SERVERS}")
    logger.info(f"Topic:  {KAFKA_TOPIC}")
    logger.info("=" * 60)
    asyncio.run(run_kafka_consumer())
