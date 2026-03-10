import sys
import PyPDF2

try:
    with open('prd_full.txt', 'w', encoding='utf-8') as out:
        out.write('--- PolicyMe PRD.pdf ---\n')
        for p in PyPDF2.PdfReader('PolicyMe PRD.pdf').pages:
            out.write(p.extract_text() + '\n')
            
        out.write('\n--- PolicyMe AI Build Guide.pdf ---\n')
        for p in PyPDF2.PdfReader('PolicyMe AI Build Guide.pdf').pages:
            out.write(p.extract_text() + '\n')
    print("Successfully read PDFs to 'prd_full.txt'")
except Exception as e:
    print(f"Error: {e}")
