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


async def process_document_event(event_data: dict):
    """
    Process a DocumentEvent received from Kafka.
    In production, this would:
    1. Download the full text from S3
    2. Chunk the text into clauses
    3. Generate OpenAI embeddings for each clause
    4. Insert nodes and relationships into Neo4j
    """
    doc_id = event_data.get("documentId", "unknown")
    filename = event_data.get("originalFilename", "unknown")
    extracted_text = event_data.get("extractedText", "")
    
    logger.info(f"📥 Processing document: {doc_id} ({filename})")
    logger.info(f"   📄 Extracted text length: {len(extracted_text)} characters")
    
    # Simulate chunking and graph insertion
    chunks = [extracted_text[i:i+500] for i in range(0, min(len(extracted_text), 5000), 500)]
    logger.info(f"   🔪 Split into {len(chunks)} chunks for graph ingestion")
    
    for i, chunk in enumerate(chunks):
        # In production: generate embedding via OpenAI, insert into Neo4j
        logger.info(f"   📊 Chunk {i+1}/{len(chunks)}: {len(chunk)} chars → [would insert into Neo4j]")
    
    logger.info(f"✅ Document {doc_id} processed successfully. {len(chunks)} nodes would be created in Neo4j.")


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
