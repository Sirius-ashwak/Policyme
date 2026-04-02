import { NextResponse } from "next/server";
import { listManagerConflicts } from "@/lib/demo-store";

export async function GET() {
    return NextResponse.json(
        { conflicts: listManagerConflicts() },
        { status: 200 }
    );
}
