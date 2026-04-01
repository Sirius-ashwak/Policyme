"""
Kafka Consumer for PolicyMe GraphRAG Engine.
Listens for DocumentEvent messages published by the Java Spring Boot Ingestion API.
When a new document is uploaded, this consumer picks it up and triggers
Neo4j graph ingestion.

Run this separately alongside the FastAPI server:
    python kafka_consumer.py
"""

import asyncio
import hashlib
import json
import os
import logging
from collections import OrderedDict
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

from dotenv import load_dotenv
from google import genai
from langchain_text_splitters import RecursiveCharacterTextSplitter

from database import insert_document_and_chunks

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


def parse_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def parse_int(value: str, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def parse_float(value: str, default: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


APP_ENV = os.getenv("APP_ENV", "local").strip().lower()
ENABLE_MOCKS = parse_bool(os.getenv("ENABLE_MOCKS"), default=True)
ALLOW_MOCKS = APP_ENV == "local" and ENABLE_MOCKS

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "policyme.document.uploaded")
KAFKA_GROUP_ID = os.getenv("KAFKA_GROUP_ID", "graphrag-consumer-group")
KAFKA_DLQ_TOPIC = os.getenv("KAFKA_DLQ_TOPIC", f"{KAFKA_TOPIC}.dlq")
KAFKA_MAX_RETRIES = parse_int(os.getenv("KAFKA_MAX_RETRIES"), default=3)
KAFKA_RETRY_BASE_DELAY_SECONDS = parse_float(os.getenv("KAFKA_RETRY_BASE_DELAY_SECONDS"), default=1.0)
KAFKA_RETRY_MAX_DELAY_SECONDS = parse_float(os.getenv("KAFKA_RETRY_MAX_DELAY_SECONDS"), default=30.0)
MAX_RECENT_EVENT_KEYS = parse_int(os.getenv("KAFKA_MAX_RECENT_EVENT_KEYS"), default=2000)

RECENT_EVENT_KEYS = OrderedDict()

# Try importing the kafka library; if not available, use a mock consumer.
try:
    from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False
    logger.warning("aiokafka not installed. Running in mock consumer mode.")

# Gemini Embeddings
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def deserialize_kafka_message(payload: bytes) -> Dict[str, Any]:
    try:
        return json.loads(payload.decode("utf-8"))
    except Exception as exc:
        return {
            "_decode_error": str(exc),
            "_raw_payload": payload.decode("utf-8", errors="replace"),
        }


def build_event_key(event_data: Dict[str, Any], topic: str, partition: int, offset: int) -> str:
    document_id = event_data.get("documentId")
    if document_id:
        return f"document:{document_id}"

    fallback_value = json.dumps(event_data, sort_keys=True, default=str)
    digest = hashlib.sha256(fallback_value.encode("utf-8")).hexdigest()
    return f"{topic}:{partition}:{offset}:{digest}"


def seen_recently(event_key: str) -> bool:
    if event_key in RECENT_EVENT_KEYS:
        RECENT_EVENT_KEYS.move_to_end(event_key)
        return True
    return False


def remember_event(event_key: str) -> None:
    RECENT_EVENT_KEYS[event_key] = 1
    RECENT_EVENT_KEYS.move_to_end(event_key)
    while len(RECENT_EVENT_KEYS) > MAX_RECENT_EVENT_KEYS:
        RECENT_EVENT_KEYS.popitem(last=False)


def build_mock_embedding(text: str) -> list[float]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    return [round(byte / 255.0, 6) for byte in digest[:32]]


async def get_embedding(text: str):
    """Get embedding from Gemini text-embedding-004, with local-only mock fallback."""
    try:
        response = gemini_client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )
        return response.embeddings[0].values
    except Exception as exc:
        if ALLOW_MOCKS:
            logger.warning("Embedding generation failed; using deterministic local mock embedding. Error: %s", exc)
            return build_mock_embedding(text)
        raise RuntimeError("Embedding generation failed and mock fallbacks are disabled.") from exc

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
    is_separator_regex=False,
)

async def process_document_event(event_data: dict):
    """
    Process a DocumentEvent received from Kafka.
    1. Reads extracted text from the event payload.
    2. Chunks the text.
    3. Generates embeddings using Gemini.
    4. Inserts into Neo4j.
    """
    if event_data.get("_decode_error"):
        raise ValueError(f"Kafka message decode failure: {event_data.get('_decode_error')}")

    doc_id = event_data.get("documentId")
    if not doc_id:
        raise ValueError("DocumentEvent missing required field: documentId")

    filename = event_data.get("originalFilename", "unknown")
    extracted_text = event_data.get("extractedText", "")
    if not extracted_text:
        raise ValueError(f"DocumentEvent {doc_id} has empty extractedText")
    
    logger.info("Processing document: %s (%s)", doc_id, filename)
    logger.info("Extracted text length: %s characters", len(extracted_text))
    
    # 1. Chunking
    chunks = text_splitter.split_text(extracted_text)
    logger.info("Split into %s chunks for graph ingestion", len(chunks))
    
    chunk_data_list = []
    
    for i, chunk_text in enumerate(chunks):
        logger.info("Generating embedding for chunk %s/%s (%s chars)", i + 1, len(chunks), len(chunk_text))
        # 2. Embedding
        embedding = await get_embedding(chunk_text)
        chunk_data_list.append({
            "chunk_id": f"{doc_id}-chunk-{i}",
            "text": chunk_text,
            "embedding": embedding,
            "index": i
        })
            
    # 3. Neo4j Insertion
    if chunk_data_list:
        logger.info("Inserting document and %s chunks into Neo4j", len(chunk_data_list))
        await insert_document_and_chunks(doc_id, filename, chunk_data_list)
        logger.info("Document %s processed successfully", doc_id)
    else:
        raise ValueError(f"Document {doc_id} yielded no chunks")


async def process_document_event_with_retry(event_data: Dict[str, Any]) -> Tuple[bool, Optional[Exception]]:
    max_attempts = max(1, KAFKA_MAX_RETRIES + 1)
    last_error: Optional[Exception] = None

    for attempt in range(1, max_attempts + 1):
        try:
            await process_document_event(event_data)
            return True, None
        except Exception as exc:
            last_error = exc
            if attempt >= max_attempts:
                break

            delay_seconds = min(
                KAFKA_RETRY_BASE_DELAY_SECONDS * (2 ** (attempt - 1)),
                KAFKA_RETRY_MAX_DELAY_SECONDS,
            )
            logger.warning(
                "Document processing failed on attempt %s/%s for documentId=%s. Retrying in %.1fs. Error: %s",
                attempt,
                max_attempts,
                event_data.get("documentId", "unknown"),
                delay_seconds,
                exc,
            )
            await asyncio.sleep(delay_seconds)

    return False, last_error


async def publish_to_dlq(
    producer,
    topic: str,
    partition: int,
    offset: int,
    event_data: Dict[str, Any],
    error: Exception,
) -> None:
    payload = {
        "failedAt": datetime.now(timezone.utc).isoformat(),
        "sourceTopic": topic,
        "sourcePartition": partition,
        "sourceOffset": offset,
        "error": str(error),
        "event": event_data,
    }

    if producer is None:
        logger.error("DLQ producer unavailable. Failed payload: %s", payload)
        return

    try:
        doc_id = str(event_data.get("documentId", "unknown"))
        await producer.send_and_wait(
            KAFKA_DLQ_TOPIC,
            key=doc_id.encode("utf-8"),
            value=payload,
        )
        logger.error("Sent failed message to DLQ topic=%s for documentId=%s", KAFKA_DLQ_TOPIC, doc_id)
    except Exception as exc:
        logger.exception("Failed to publish message to DLQ: %s", exc)


def normalize_event_data(value: Any) -> Dict[str, Any]:
    if isinstance(value, dict):
        return value
    if value is None:
        return {}
    return {"_non_dict_payload": str(value)}


async def run_kafka_consumer():
    """
    Main Kafka consumer loop.
    Continuously listens for DocumentEvent messages from the Spring Boot API.
    """
    if not KAFKA_AVAILABLE:
        logger.info("[MOCK MODE] Kafka consumer running in simulation mode.")
        logger.info("Would connect to: %s", KAFKA_BOOTSTRAP_SERVERS)
        logger.info("Would subscribe to topic: %s", KAFKA_TOPIC)
        logger.info("Group ID: %s", KAFKA_GROUP_ID)
        logger.info("Waiting for messages... (install aiokafka for real Kafka consumption)")
        
        # Keep the process alive
        while True:
            await asyncio.sleep(30)
            logger.info("[MOCK] Still listening for Kafka events...")
        return

    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=KAFKA_GROUP_ID,
        value_deserializer=deserialize_kafka_message,
        auto_offset_reset="earliest",
        enable_auto_commit=False,
    )

    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda value: json.dumps(value, default=str).encode("utf-8"),
    )

    await consumer.start()
    await producer.start()
    logger.info("Kafka consumer started. Listening on topic: %s", KAFKA_TOPIC)

    try:
        async for msg in consumer:
            logger.info("Received message from partition %s, offset %s", msg.partition, msg.offset)
            event_data = normalize_event_data(msg.value)
            event_key = build_event_key(event_data, msg.topic, msg.partition, msg.offset)

            if seen_recently(event_key):
                logger.warning("Duplicate event detected for key=%s. Skipping.", event_key)
                await consumer.commit()
                continue

            success, error = await process_document_event_with_retry(event_data)
            if success:
                remember_event(event_key)
                await consumer.commit()
                continue

            await publish_to_dlq(
                producer=producer,
                topic=msg.topic,
                partition=msg.partition,
                offset=msg.offset,
                event_data=event_data,
                error=error or RuntimeError("Unknown processing error"),
            )
            remember_event(event_key)
            await consumer.commit()
    finally:
        await consumer.stop()
        await producer.stop()
        logger.info("Kafka consumer stopped.")


if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("PolicyMe GraphRAG - Kafka Document Consumer")
    logger.info("Broker: %s", KAFKA_BOOTSTRAP_SERVERS)
    logger.info("Topic: %s", KAFKA_TOPIC)
    logger.info("DLQ Topic: %s", KAFKA_DLQ_TOPIC)
    logger.info("Max Retries: %s", KAFKA_MAX_RETRIES)
    logger.info("=" * 60)
    asyncio.run(run_kafka_consumer())
