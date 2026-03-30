import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Use Java Spring Boot ingestion API on port 8081
        const ingestionUrl = process.env.INGESTION_API_URL || 'http://localhost:8081';

        const response = await fetch(`${ingestionUrl}/api/documents/upload`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type manually, fetch will automatically set it with boundary for FormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ingestion Backend Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('API /upload Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
