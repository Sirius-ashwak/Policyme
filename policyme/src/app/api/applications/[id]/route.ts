import { NextResponse } from "next/server";
import { type ApplicationStatus } from "@/lib/demo-store";
import {
    getApplicationRepository,
    updateApplicationStatusRepository,
} from "@/lib/supabase-repository";

type ApplicationStatusBody = {
    status?: unknown;
};

const ALLOWED_STATUSES = new Set<ApplicationStatus>([
    "Pending Review",
    "Under Review",
    "Approved",
    "Rejected",
]);

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const result = await getApplicationRepository(id);
    const application = result.data;

    if (!application) {
        return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json(
        {
            application,
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
        const body = (await req.json()) as ApplicationStatusBody;
        const status = typeof body.status === "string" ? body.status : "";

        if (!ALLOWED_STATUSES.has(status as ApplicationStatus)) {
            return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
        }

        const result = await updateApplicationStatusRepository(id, status as ApplicationStatus);
        const application = result.data;
        if (!application) {
            return NextResponse.json({ error: "Application not found." }, { status: 404 });
        }

        return NextResponse.json(
            {
                application,
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
                error: "Failed to update application.",
                details: message,
            },
            { status: 500 }
        );
    }
}
