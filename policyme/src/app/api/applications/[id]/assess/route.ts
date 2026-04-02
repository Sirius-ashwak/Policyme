import { NextResponse } from "next/server";
import { type UnderwritingAssessment } from "@/lib/demo-store";
import {
    getApplicationRepository,
    saveApplicationAssessmentRepository,
} from "@/lib/supabase-repository";

type UnderwriteResponse = {
    risk_score?: unknown;
    factors?: unknown;
    recommend?: unknown;
    is_mock?: unknown;
};

function getGraphRagUrl(): string {
    const rawBase = process.env.GRAPHRAG_API_URL || "http://localhost:8000";
    return rawBase.replace(/\/$/, "");
}

export async function POST(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const appResult = await getApplicationRepository(id);
    const application = appResult.data;

    if (!application) {
        return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    try {
        const response = await fetch(`${getGraphRagUrl()}/api/underwrite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer_data: application.customerData,
            }),
            cache: "no-store",
        });

        if (!response.ok) {
            const detail = await response.text();
            return NextResponse.json(
                {
                    error: "Underwriting request failed.",
                    details: detail || `Upstream status ${response.status}`,
                },
                { status: response.status }
            );
        }

        const payload = (await response.json()) as UnderwriteResponse;
        const assessment: UnderwritingAssessment = {
            riskScore: typeof payload.risk_score === "number" ? payload.risk_score : 0,
            factors: Array.isArray(payload.factors)
                ? payload.factors.filter((entry): entry is string => typeof entry === "string")
                : [],
            recommend: payload.recommend === "approve" ? "approve" : "reject",
            isMock: payload.is_mock === true,
            generatedAt: new Date().toISOString(),
        };

        const updateResult = await saveApplicationAssessmentRepository(id, assessment);
        const updatedApplication = updateResult.data;
        if (!updatedApplication) {
            return NextResponse.json({ error: "Application not found." }, { status: 404 });
        }

        return NextResponse.json(
            {
                application: updatedApplication,
                source: updateResult.source,
                warning: updateResult.warning || appResult.warning,
                details: updateResult.details || appResult.details,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to run underwriting assessment.",
                details: message,
            },
            { status: 500 }
        );
    }
}
