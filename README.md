# PolicyMe

An open-source intelligent insurance analysis and agentic OCR platform. PolicyMe provides a complete microservice architecture to ingest, analyze, and resolve complex insurance documents through AI-powered graph extraction and retrieval-augmented generation (GraphRAG).

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Architecture Overview

PolicyMe is designed as a distributed, decoupled system capable of handling high-volume document pipelines and complex semantic queries.

The architecture consists of three primary domains:

1. **Client & Presentation:** A Next.js dashboard and portal handling user authentication, document upload orchestration, and interactive knowledge graph visualization.
2. **Document Ingestion Pipeline:** A Java Spring Boot service responsible for taking raw binaries, performing OCR preprocessing, persisting to object storage (S3), and routing extracted text payloads to event streams.
3. **GraphRAG Intelligence Engine:** A Python backend consuming event streams, utilizing open-weights local LLMs (via Ollama) to parse semantic relationships, and storing the resulting knowledge graphs in Neo4j for advanced claim resolution.

## Repository Structure

This repository is a monorepo containing the following discrete services:

### `policyme/`
The frontend and API gateway.
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS, Framer Motion
- UI Components: Radix primitives

### `policyme-java-ingestion/`
The document intake and preprocessing service.
- Framework: Java 17, Spring Boot
- Messaging: Apache Kafka integration
- Storage: S3 abstraction layer

### `policyme-graphrag-engine/`
The core AI analysis and graph extraction service.
- Framework: Python 3.10+, FastAPI
- AI integration: LangChain, Ollama (local models)
- Database: Neo4j

## Prerequisites

To run the complete platform locally, ensure the following dependencies are installed:

- Node.js (v18.x or newer)
- Java Development Kit (JDK 17)
- Apache Maven
- Python (v3.10.x or newer)
- Docker and Docker Compose (required for standing up Neo4j and Kafka)
- Ollama (running locally with the required LLM models pulled)

## Getting Started

Because PolicyMe is a distributed platform, each service must be configured and booted individually or orchestrated via Docker. 

Please refer to the detailed `README.md` located within each service directory for specific installation, configuration, and execution commands.

1. Start infrastructure dependencies (Neo4j, Kafka) using Docker.
2. Boot the Java Ingestion service: `cd policyme-java-ingestion && mvn spring-boot:run`
3. Boot the Python Engine: `cd policyme-graphrag-engine && python main.py`
4. Boot the Next.js Frontend: `cd policyme && npm run dev`

## Contributing

Contributions to PolicyMe are welcome. Please ensure that pull requests adhere to the existing architectural patterns and include appropriate tests for new functionality. Focus on maintaining the separation of concerns between the ingestion, analysis, and presentation layers.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
