import { NextRequest, NextResponse } from "next/server";
import { type GraphOperationType } from "@/lib/demo-store";
import { recordGraphOperationRepository } from "@/lib/supabase-repository";

export async function POST(req: NextRequest) {
    const payload = (await req.json().catch(() => ({}))) as { action?: GraphOperationType };

    if (payload.action !== "reindex" && payload.action !== "refresh_vectors") {
        return NextResponse.json(
            { error: "Unsupported graph action." },
            { status: 400 }
        );
    }

    const result = await recordGraphOperationRepository(payload.action);

    return NextResponse.json(
        {
            operation: result.data.operation,
            operations: result.data.operations,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}
