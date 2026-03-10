# PolicyMe AI Claims Platform

PolicyMe is an intelligent insurance analysis and agentic OCR platform. This repository contains the complete microservice architecture to ingest, analyze, and resolve complex insurance documents through AI-powered graph extraction.

## Architecture

This is a monolithic repository containing three primary services:

1. **[policyme](./policyme/)** (Frontend / API Layer)
   - A modern Next.js 14 Web Application built with the App Router, Tailwind CSS, and Framer Motion.
   - Provides the Dashboard, Portals for Adjusters and Managers, and the Interactive Knowledge Graph visualization UI.

2. **[policyme-java-ingestion](./policyme-java-ingestion/)** (Document Ingestion Service)
   - A robust Spring Boot Java service responsible for handling high-volume document uploads.
   - Features OCR preprocessing, S3 storage abstraction, and producing structured text payloads to Kafka topics.

3. **[policyme-graphrag-engine](./policyme-graphrag-engine/)** (AI Engine & Knowledge Graph)
   - A Python-based GraphRAG engine utilizing LangChain and Local LLMs (Ollama `llama3.2:1b`).
   - Consumes Kafka topics, parses insurance documents into semantic knowledge graphs, and interfaces with the Neo4j database to power complex claim analysis queries.

## Getting Started

Each service maintains its own dependencies and run instructions. Please navigate to the respective subdirectories to view their specific `README.md` files for setup and execution commands.

**Quick Start Prerequisites:**
- Node.js (v18+)
- Java JDK 17 & Maven
- Python 3.10+
- Docker & Docker Compose (for Neo4j and Kafka)

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
