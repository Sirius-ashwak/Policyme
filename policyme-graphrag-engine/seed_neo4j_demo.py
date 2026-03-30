import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "policyme_secret")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Cypher query to insert Demo Users, Reports, and link them to policy documents
# We use the 'filename' property for the node labeling text because that is what 
# our macro_graph parser looks for (n.get("filename")).
query = """
// 1. Create Demo Users
MERGE (admin:User {id: 'admin_01'}) SET admin.filename = 'Admin: Alice'
MERGE (adj:User {id: 'adj_01'}) SET adj.filename = 'Adjuster: Bob'
MERGE (mgr:User {id: 'mgr_01'}) SET mgr.filename = 'Manager: Charlie'

// 2. Create Demo Reports
MERGE (rep1:Report {id: 'rep_101'}) SET rep1.filename = 'Demo Damage Report #101'
MERGE (rep2:Report {id: 'rep_102'}) SET rep2.filename = 'Demo Fraud Audit #102'

// 3. Create Demo Policy Documents
MERGE (pol1:Document {id: 'pol_1'}) SET pol1.filename = 'Property_Damage_Policy.pdf'
MERGE (pol2:Document {id: 'pol_2'}) SET pol2.filename = 'Fraud_Audit_Guidelines.pdf'

// 4. Create Interconnecting Relationships (Graph edges)
MERGE (adj)-[:SUBMITTED]->(rep1)
MERGE (mgr)-[:REVIEWED]->(rep1)
MERGE (rep1)-[:REFERENCES]->(pol1)

MERGE (mgr)-[:SUBMITTED]->(rep2)
MERGE (admin)-[:AUDITED]->(rep2)
MERGE (rep2)-[:REFERENCES]->(pol2)
"""

def run_seed():
    try:
        with driver.session() as session:
            session.run(query)
            print("✅ Successfully injected demo Users and Reports into the Neo4j Graph!")
    except Exception as e:
        print(f"❌ Failed to insert demo data: {e}")

if __name__ == "__main__":
    run_seed()
