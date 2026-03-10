import docx

try:
    doc = docx.Document("PolicyMe PRD v2.docx")
    text = '\n'.join([para.text for para in doc.paragraphs])
    with open("prd_v2_full.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted PRD v2")
except Exception as e:
    print(f"Error: {e}")
