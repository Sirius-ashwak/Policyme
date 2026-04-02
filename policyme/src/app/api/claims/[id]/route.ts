import { NextResponse } from "next/server";
import { type ClaimStatus } from "@/lib/demo-store";
import {
    getClaimRepository,
    updateClaimStatusRepository,
} from "@/lib/supabase-repository";

type ClaimStatusBody = {
    status?: unknown;
};

const ALLOWED_STATUSES = new Set<ClaimStatus>([
    "Submitted",
    "Under Review",
    "Urgent",
    "Approved",
    "Rejected",
    "Closed",
]);

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const result = await getClaimRepository(id);
    const claim = result.data;

    if (!claim) {
        return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    return NextResponse.json(
        {
            claim,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const body = (await req.json()) as ClaimStatusBody;
        const status = typeof body.status === "string" ? body.status : "";

        if (!ALLOWED_STATUSES.has(status as ClaimStatus)) {
            return NextResponse.json({ error: "Invalid claim status." }, { status: 400 });
        }

        const result = await updateClaimStatusRepository(id, status as ClaimStatus);
        const claim = result.data;
        if (!claim) {
            return NextResponse.json({ error: "Claim not found." }, { status: 404 });
        }

        return NextResponse.json(
            {
                claim,
                source: result.source,
                warning: result.warning,
                details: result.details,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to update claim.",
                details: message,
            },
            { status: 500 }
        );
    }
}
