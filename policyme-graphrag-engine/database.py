import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "policyme_secret")
APP_ENV = os.getenv("APP_ENV", "local").strip().lower()
ENABLE_MOCKS = os.getenv("ENABLE_MOCKS", "false").strip().lower() in {"1", "true", "yes", "on"}

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


def mock_mode_enabled() -> bool:
    return APP_ENV == "local" and ENABLE_MOCKS


def build_mock_clause_response(query: str):
    q_lower = query.lower()
    if "remote" in q_lower or "work" in q_lower:
        return {
            "clauses": [
                {
                    "id": "HR Policy 3.2",
                    "text": "Employees are allowed to work remotely up to 3 days per week.",
                    "department": "HR",
                },
                {
                    "id": "Security 4.1",
                    "text": "Remote workers must use company VPN.",
                    "department": "IT",
                },
            ]
        }
    if "windshield" in q_lower or "damage" in q_lower:
        return {
            "clauses": [
                {
                    "id": "Auto Policy 7",
                    "text": "Windshield damage is covered with no deductible.",
                    "department": "Claims",
                },
                {
                    "id": "Auto Policy 12",
                    "text": "Comprehensive claims require a 500 USD deductible.",
                    "department": "Claims",
                },
            ]
        }
    return {
        "clauses": [
            {
                "id": "General 1.1",
                "text": "Standard corporate operating procedure default clause.",
                "department": "Legal",
            }
        ]
    }


async def insert_document_and_chunks(document_id: str, filename: str, chunk_data_list: list):
    """
    Insert or update document/chunk nodes in Neo4j.
    Uses MERGE semantics so retries and duplicate events are idempotent.
    """
    if not chunk_data_list:
        return

    cypher_query = """
    MERGE (d:Document {id: $document_id})
    ON CREATE SET d.createdAt = datetime()
    SET d.filename = $filename,
        d.updatedAt = datetime()
    WITH d
    UNWIND $chunks AS chunk
    MERGE (c:Chunk {id: chunk.chunk_id})
    ON CREATE SET c.createdAt = datetime()
    SET c.text = chunk.text,
        c.embedding = chunk.embedding,
        c.index = chunk.index,
        c.documentId = $document_id,
        c.updatedAt = datetime()
    MERGE (d)-[:HAS_CHUNK]->(c)
    """

    try:
        with driver.session() as session:
            session.run(
                cypher_query,
                document_id=document_id,
                filename=filename,
                chunks=chunk_data_list,
            )
    except Exception as e:
        print(f"Neo4j insert error: {e}")
        if mock_mode_enabled():
            print("Skipping Neo4j insert in local mock mode.")
            return
        raise RuntimeError("Neo4j insert failed and mock fallbacks are disabled.") from e

async def search_neo4j_graph(query: str):
    """
    Search for matching clauses in Neo4j.
    If local mocks are enabled, uses mock data as a fallback.
    """
    cypher_query = """
    MATCH (clause:Clause)
    WHERE clause.text IS NOT NULL
      AND toLower(clause.text) CONTAINS toLower($query)
    RETURN
      coalesce(clause.id, clause.clauseId, clause.section, elementId(clause)) AS id,
      clause.text AS text,
      coalesce(clause.department, "Unknown") AS department
    LIMIT 10
    """

    try:
        with driver.session() as session:
            result = session.run(cypher_query, query=query)
            clauses = []
            for record in result:
                clause_text = record.get("text")
                if clause_text:
                    clauses.append(
                        {
                            "id": record.get("id", "Unknown"),
                            "text": clause_text,
                            "department": record.get("department", "Unknown"),
                        }
                    )

        if clauses:
            return {"clauses": clauses}

        if mock_mode_enabled():
            print("No live Neo4j matches found. Falling back to local mock clauses.")
            return build_mock_clause_response(query)

        return {"clauses": []}
            
    except Exception as e:
        print(f"Database error: {e}")
        if mock_mode_enabled():
            print("Neo4j query failed. Falling back to local mock clauses.")
            return build_mock_clause_response(query)
        raise RuntimeError("Neo4j query failed and mock fallbacks are disabled.") from e

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
        if not mock_mode_enabled():
            raise RuntimeError("Neo4j policy lookup failed and mock fallbacks are disabled.") from e
        
    # 2. Demo Safety Fallback: If no clauses found or DB drops, return high-fidelity mock graph data
    if not extracted_text:
        if not mock_mode_enabled():
            raise RuntimeError(
                f"No policy graph data found for customer '{customer_name}' and mock fallbacks are disabled."
            )
        print("Falling back to simulated Neo4j context for Demo Safety.")
        extracted_text = f"""
        Customer: {customer_name} has Homeowners Policy (#POL-HOME-991)
        - Section 4B: Covers rain water damage up to ₹5,00,000.
        - Section 5A: Windshield and storm damage covered without deductible.
        - Clause 12.3: Requires written claim within 30 days of incident.
        - Exclusion: Acts of god normally covered, unless severe neglected maintenance.
        """
        
    return extracted_text
