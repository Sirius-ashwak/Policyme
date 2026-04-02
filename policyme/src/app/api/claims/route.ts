import { NextResponse } from "next/server";
import { type ClaimEvidenceFile } from "@/lib/demo-store";
import {
    createClaimRepository,
    listClaimsRepository,
} from "@/lib/supabase-repository";

type CreateClaimBody = {
    claimType?: unknown;
    incidentDate?: unknown;
    incidentTime?: unknown;
    description?: unknown;
    location?: unknown;
    estimatedAmount?: unknown;
    evidenceFiles?: unknown;
};

function sanitizeEvidenceFiles(value: unknown): ClaimEvidenceFile[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
        .map((entry) => ({
            name: typeof entry.name === "string" ? entry.name : "attachment",
            sizeBytes: typeof entry.sizeBytes === "number" ? entry.sizeBytes : 0,
            type: typeof entry.type === "string" ? entry.type : "application/octet-stream",
        }));
}

export async function GET() {
    const result = await listClaimsRepository();

    return NextResponse.json(
        {
            claims: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CreateClaimBody;
        const claimType = typeof body.claimType === "string" ? body.claimType.trim() : "";
        const incidentDate = typeof body.incidentDate === "string" ? body.incidentDate.trim() : "";
        const description = typeof body.description === "string" ? body.description.trim() : "";
        const location = typeof body.location === "string" ? body.location.trim() : "";
        const estimatedAmount = typeof body.estimatedAmount === "string" ? body.estimatedAmount.trim() : "";

        if (!claimType || !incidentDate || !description || !location || !estimatedAmount) {
            return NextResponse.json(
                {
                    error: "Missing required fields.",
                    details: "claimType, incidentDate, description, location, and estimatedAmount are required.",
                },
                { status: 400 }
            );
        }

        const result = await createClaimRepository({
            claimType,
            incidentDate,
            incidentTime: typeof body.incidentTime === "string" ? body.incidentTime.trim() : "",
            description,
            location,
            estimatedAmount,
            evidenceFiles: sanitizeEvidenceFiles(body.evidenceFiles),
        });

        return NextResponse.json(
            {
                claim: result.data,
                source: result.source,
                warning: result.warning,
                details: result.details,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to create claim.",
                details: message,
            },
            { status: 500 }
        );
    }
}
