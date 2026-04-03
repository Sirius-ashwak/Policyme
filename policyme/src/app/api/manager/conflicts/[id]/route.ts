import { NextRequest, NextResponse } from "next/server";
import {
    type ManagerConflictResolution,
    resolveManagerConflict,
} from "@/lib/demo-store";

const RUNTIME_ENV = (process.env.APP_ENV || process.env.NODE_ENV || "local").toLowerCase();
const DEMO_ALLOWED =
    RUNTIME_ENV === "local" ||
    RUNTIME_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    if (!DEMO_ALLOWED) {
        return NextResponse.json(
            { error: "Manager conflict resolution demo endpoint is disabled outside local/demo mode." },
            { status: 501 }
        );
    }

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
