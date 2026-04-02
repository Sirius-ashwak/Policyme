import { NextResponse } from "next/server";
import { getGraphSnapshotRepository } from "@/lib/supabase-repository";

export async function GET() {
    const result = await getGraphSnapshotRepository();

    return NextResponse.json(
        {
            documents: result.data.documents,
            operations: result.data.operations,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}
