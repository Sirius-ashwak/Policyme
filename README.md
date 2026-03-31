# PolicyMe

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/Python-FastAPI-blue" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-green" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Database-Neo4j-blueviolet" alt="Neo4j" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

An open-source, intelligent insurance analysis and agentic OCR platform. PolicyMe provides a robust microservice architecture to ingest, analyze, and resolve complex insurance documents through AI-powered graph extraction and retrieval-augmented generation (GraphRAG).

## Key Features

- **Agentic OCR Pipeline:** Automated, high-precision document ingestion and text extraction.
- **GraphRAG Intelligence:** Deep semantic relationship parsing using local LLMs.
- **Microservices Architecture:** Highly scalable, decoupled services designed for heavy workloads.
- **Interactive Dashboards:** Modern web interfaces for real-time visualization and claim management.

## Architecture & Tech Stack

PolicyMe is designed as a distributed system capable of handling high-volume document pipelines and complex semantic queries across three primary domains:

1. **Client & Presentation (`/policyme`)** 
   - A Next.js 14 dashboard and portal handling user authentication, document upload orchestration, and interactive knowledge graph visualization.
   - *Tech:* React, Tailwind CSS, Framer Motion, Radix UI.

2. **Document Ingestion Pipeline (`/policyme-java-ingestion`)** 
   - A robust Java Spring Boot service responsible for taking raw binaries, performing OCR preprocessing, persisting to object storage (S3), and routing text payloads.
   - *Tech:* Java 17, Spring Boot, Apache Kafka, S3.

3. **GraphRAG Intelligence Engine (`/policyme-graphrag-engine`)** 
   - A Python backend consuming event streams, utilizing open-weights local LLMs via Ollama to parse semantic relationships, and storing the resulting knowledge graphs in Neo4j.
   - *Tech:* Python 3.10+, FastAPI, LangChain, Ollama, Neo4j.

## Repository Structure

This repository is a monorepo containing our discrete services:

```text
policyme/
├── policyme/                   # Frontend & API Gateway (Next.js)
├── policyme-java-ingestion/    # Document intake & OCR (Java)
└── policyme-graphrag-engine/   # AI analysis & GraphRAG (Python)
```

## Getting Started

### Prerequisites

To run the complete platform locally, ensure the following dependencies are installed:

- **Node.js**: v18.x or newer
- **Java**: JDK 17 & Apache Maven
- **Python**: v3.10.x or newer
- **Docker**: For infrastructure dependencies (Neo4j, Kafka)
- **Ollama**: Running locally with required models

### Installation & Execution

Because PolicyMe is a distributed platform, services can be orchestrated via Docker or booted individually. Please refer to the specific `README.md` in each service directory for deep-dive instructions.

**Quick Start Workflow:**

1. **Infrastructure:** Start data stores and message brokers (Neo4j, Kafka) using Docker.
2. **Ingestion Service:**
   ```bash
   cd policyme-java-ingestion
   mvn spring-boot:run
   ```
3. **Intelligence Engine:**
   ```bash
   cd policyme-graphrag-engine
   pip install -r requirements.txt
   python main.py
   ```
4. **Web Client:**
   ```bash
   cd policyme
   npm install
   npm run dev
   ```

## Contributing

Contributions to PolicyMe are always welcome! 

When contributing, please ensure your pull requests adhere to our architectural patterns. Maintain the strict separation of concerns between the ingestion, analysis, and presentation layers, and include appropriate tests for any new functionality.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
