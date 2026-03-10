import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Use environment variable or default to localhost on port 8000 (Python FastAPI)
        const graphragUrl = process.env.GRAPHRAG_API_URL || 'http://localhost:8000';

        const response = await fetch(`${graphragUrl}/graphrag/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: body.query,
                userId: body.userId || 'anonymous_adjuster'
            }),
            next: { revalidate: 0 } // No caching for initial tests
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GraphRAG Engine Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('API /query Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
