import { NextRequest, NextResponse } from "next/server";
import {
    type ManagerConflictResolution,
    resolveManagerConflict,
} from "@/lib/demo-store";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const payload = (await req.json().catch(() => ({}))) as { resolution?: ManagerConflictResolution };
    const params = await context.params;

    if (payload.resolution !== "A" && payload.resolution !== "B") {
        return NextResponse.json(
            { error: "Resolution must be 'A' or 'B'." },
            { status: 400 }
        );
    }

    const conflict = resolveManagerConflict(params.id, payload.resolution);
    if (!conflict) {
        return NextResponse.json(
            { error: "Conflict not found." },
            { status: 404 }
        );
    }

    return NextResponse.json({ conflict }, { status: 200 });
}
