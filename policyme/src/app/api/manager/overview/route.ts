import { NextResponse } from "next/server";
import { getManagerOverview, listManagerConflicts } from "@/lib/demo-store";

export async function GET() {
    const overview = getManagerOverview();
    const conflicts = listManagerConflicts().filter((conflict) => conflict.status === "Open").slice(0, 4);

    return NextResponse.json(
        {
            overview,
            conflicts,
        },
        { status: 200 }
    );
}
