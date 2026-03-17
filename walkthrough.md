# PolicyMe Local Infrastructure Walkthrough (From Scratch)

If you are starting from a fresh environment, follow these steps in order to get the entire pipeline running.

## 1. Start Local Infrastructure
The core services (Kafka and Neo4j) must be running first.

```powershell
cd policyme-java-ingestion
docker-compose up -d
```
*Wait a few seconds for Neo4j to initialize. You can check status with `docker ps`.*
- **Neo4j Browser**: [http://localhost:7474](http://localhost:7474) (Login: `neo4j` / `policyme_secret`)

## 2. Java Ingestion API
This service accepts PDF uploads and publishes events to Kafka.

```powershell
cd policyme-java-ingestion

# Build the application (requires Maven)
mvn clean install

# Run the application
mvn spring-boot:run
# OR run the jar after build
java -jar target/policyme-ingestion-1.0.0.jar
```
*Note: The API will run on `http://localhost:8081`.*

## 3. Python GraphRAG Engine
This service consumes Kafka events and updates the Neo4j graph.

```powershell
cd policyme-graphrag-engine

# Recommendation: Create a virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Kafka Consumer (listens for uploads)
python kafka_consumer.py

# Start the GraphRAG API (FastAPI) - Run in a separate terminal
python main.py
```

## 4. Verification Check
I successfully verified that the Neo4j database is accessible and can store the document/chunk relationships used by the pipeline:

```sql
// Result of verification query:
docId: "DOC-TEST001"
chunkId: "DOC-TEST001-chunk-0"
text: "This is a sample insurance policy document."
```

---
> [!TIP]
> Make sure you have **Ollama** running locally if the Python engine needs to generate embeddings.
