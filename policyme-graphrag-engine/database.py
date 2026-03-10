import os
from neo4j import GraphDatabase
from dotenv import load_dotenv
import asyncio

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

async def search_neo4j_graph(query: str):
    """
    Simulates sending the query through OpenAI embeddings and 
    performing a vector similarity search in Neo4j, followed by graph traversal.
    """
    try:
        # In a real implementation:
        # 1. embedding = get_openai_embedding(query)
        # 2. MATCH (c:Clause) CALL db.index.vector.queryNodes('clause_embedding', 10, embedding) YIELD node, score
        # 3. MATCH (node)<-[:CONTAINS]-(p:Policy) RETURN node, p
        
        # Test query mapping for prototype responses
        q_lower = query.lower()
        if "remote" in q_lower or "work" in q_lower:
            return {
                "clauses": [
                    {"id": "HR Policy § 3.2", "text": "Employees are allowed to work remotely up to 3 days per week.", "department": "HR"},
                    {"id": "Security § 4.1", "text": "Remote workers must use company VPN.", "department": "IT"}
                ]
            }
        elif "windshield" in q_lower or "damage" in q_lower:
            return {
                "clauses": [
                    {"id": "Auto Policy § 7", "text": "Windshield damage is covered with no deductible.", "department": "Claims"},
                    {"id": "Auto Policy § 12", "text": "Comprehensive claims require a $500 deductible.", "department": "Claims"} # Simulated conflict
                ]
            }
        
        # Default fallback
        return {
            "clauses": [
                {"id": "General § 1.1", "text": "Standard corporate operating procedure default clause.", "department": "Legal"}
            ]
        }
            
    except Exception as e:
        print(f"Database error: {e}")
        return {"clauses": []}
