import { NextResponse } from "next/server";

type ChatMessage = {
    role: string;
    content: string;
};

type QueryPayload = {
    query?: unknown;
    userId?: unknown;
    chat_history?: unknown;
    extracted_data?: unknown;
};

const REQUEST_TIMEOUT_MS = 25_000;

function sanitizeChatHistory(value: unknown): ChatMessage[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
        .map((entry) => ({
            role: typeof entry.role === "string" ? entry.role : "user",
            content: typeof entry.content === "string" ? entry.content : "",
        }))
        .filter((entry) => entry.content.trim().length > 0);
}

function sanitizeExtractedData(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
}

function getGraphRagUrl(): string {
    const rawBase = process.env.GRAPHRAG_API_URL || "http://localhost:8000";
    return rawBase.replace(/\/$/, "");
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as QueryPayload;
        const query = typeof body.query === "string" ? body.query.trim() : "";

        if (!query) {
            return NextResponse.json({ error: "Query is required." }, { status: 400 });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        let response: Response;
        try {
            response = await fetch(`${getGraphRagUrl()}/graphrag/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    userId: typeof body.userId === "string" ? body.userId : "anonymous_adjuster",
                    chat_history: sanitizeChatHistory(body.chat_history),
                    extracted_data: sanitizeExtractedData(body.extracted_data),
                }),
                cache: "no-store",
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            const errorText = await response.text();
            const detail = errorText.trim() || "Upstream GraphRAG request failed.";
            throw new Error(`GraphRAG Engine Error (${response.status}): ${detail}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
            return NextResponse.json(
                { error: `GraphRAG request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.` },
                { status: 504 }
            );
        }

        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("API /query route error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
