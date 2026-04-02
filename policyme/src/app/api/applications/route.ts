import { NextResponse } from "next/server";
import {
    createApplicationRepository,
    listApplicationsRepository,
} from "@/lib/supabase-repository";

type CreateApplicationPayload = {
    applicantName?: unknown;
    applicantEmail?: unknown;
    applicantOrganization?: unknown;
    policyType?: unknown;
    requestedCoverage?: unknown;
    assetValue?: unknown;
    location?: unknown;
    claimsHistory?: unknown;
    description?: unknown;
    customerData?: unknown;
};

export async function GET() {
    const result = await listApplicationsRepository();

    return NextResponse.json(
        {
            applications: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}

function asTrimmedString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function sanitizeCustomerData(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return {};
    }

    return value as Record<string, unknown>;
}

export async function POST(req: Request) {
    const payload = (await req.json().catch(() => ({}))) as CreateApplicationPayload;

    const applicantName = asTrimmedString(payload.applicantName);
    const applicantEmail = asTrimmedString(payload.applicantEmail);
    const applicantOrganization = asTrimmedString(payload.applicantOrganization) || applicantName;
    const policyType = asTrimmedString(payload.policyType);
    const requestedCoverage = asTrimmedString(payload.requestedCoverage);
    const assetValue = asTrimmedString(payload.assetValue);
    const location = asTrimmedString(payload.location);
    const claimsHistory = asTrimmedString(payload.claimsHistory);
    const description = asTrimmedString(payload.description);

    if (
        !applicantName ||
        !applicantEmail ||
        !policyType ||
        !requestedCoverage ||
        !assetValue ||
        !location ||
        !claimsHistory ||
        !description
    ) {
        return NextResponse.json(
            { error: "Missing required application fields." },
            { status: 400 }
        );
    }

    const result = await createApplicationRepository({
        applicantName,
        applicantEmail,
        applicantOrganization,
        policyType,
        requestedCoverage,
        assetValue,
        location,
        claimsHistory,
        description,
        customerData: sanitizeCustomerData(payload.customerData),
    });

    return NextResponse.json(
        {
            application: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 201 }
    );
}
