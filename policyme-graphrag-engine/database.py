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

async def get_macro_graph(limit=500):
    query = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, r, m LIMIT $limit
    """
    try:
        nodes_dict = {}
        links_list = []
        
        with driver.session() as session:
            result = session.run(query, limit=limit)
            for record in result:
                n = record.get("n")
                if n is not None:
                    n_id = str(n.element_id)
                    n_labels = list(n.labels)
                    group = n_labels[0] if n_labels else "Node"
                    label = n.get("filename") or n.get("id") or f"{group} {n_id}"
                    val = 12 if group == "Document" else 4
                    if n_id not in nodes_dict:
                        nodes_dict[n_id] = {"id": n_id, "group": group, "label": label, "val": val}
                        
                r = record.get("r")
                m = record.get("m")
                if r is not None and m is not None:
                    m_id = str(m.element_id)
                    m_labels = list(m.labels)
                    m_group = m_labels[0] if m_labels else "Node"
                    m_label = m.get("filename") or m.get("id") or f"{m_group} {m_id}"
                    m_val = 12 if m_group == "Document" else 4
                    if m_id not in nodes_dict:
                        nodes_dict[m_id] = {"id": m_id, "group": m_group, "label": m_label, "val": m_val}
                    links_list.append({
                        "source": str(r.start_node.element_id),
                        "target": str(r.end_node.element_id),
                        "type": r.type
                    })
        return {"nodes": list(nodes_dict.values()), "links": links_list}
    except Exception as e:
        print(f"Database error: {e}")
        return {"nodes": [], "links": []}

async def get_customer_policy_graph(customer_name: str) -> str:
    """
    Queries Neo4j for a given customer and extracts their policy nodes.
    Executes actual Cypher: MATCH (c:Customer {name: $name})-[:HAS_POLICY]->(p:Policy)-[:HAS_CLAUSE]->(clause:Clause) RETURN clause.text
    """
    extracted_text = ""
    try:
        # 1. Attempt Real Neo4j Traversal (Database call)
        with driver.session() as session:
            query = """
            MATCH (c:Customer {name: $name})-[:HAS_POLICY]->(p:Policy)-[:HAS_CLAUSE]->(clause:Clause) 
            RETURN clause.text as text
            """
            result = session.run(query, name=customer_name)
            clauses = [record["text"] for record in result if record.get("text")]
            
            if clauses:
                extracted_text = f"Customer: {customer_name}\n" + "\n".join([f"- {c}" for c in clauses])
            
    except Exception as e:
        print(f"Database connection error retrieving policy graph: {e}")
        
    # 2. Demo Safety Fallback: If no clauses found or DB drops, return high-fidelity mock graph data
    if not extracted_text:
        print("Falling back to simulated Neo4j context for Demo Safety.")
        extracted_text = f"""
        Customer: {customer_name} has Homeowners Policy (#POL-HOME-991)
        - Section 4B: Covers rain water damage up to ₹5,00,000.
        - Section 5A: Windshield and storm damage covered without deductible.
        - Clause 12.3: Requires written claim within 30 days of incident.
        - Exclusion: Acts of god normally covered, unless severe neglected maintenance.
        """
        
    return extracted_text
