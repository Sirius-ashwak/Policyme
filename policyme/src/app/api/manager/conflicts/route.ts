import { NextResponse } from "next/server";
import { listManagerConflicts } from "@/lib/demo-store";

const RUNTIME_ENV = (process.env.APP_ENV || process.env.NODE_ENV || "local").toLowerCase();
const DEMO_ALLOWED =
    RUNTIME_ENV === "local" ||
    RUNTIME_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function GET() {
    if (!DEMO_ALLOWED) {
        return NextResponse.json(
            { error: "Manager conflicts demo endpoint is disabled outside local/demo mode." },
            { status: 501 }
        );
    }

    return NextResponse.json(
        { conflicts: listManagerConflicts() },
        { status: 200 }
    );
}
