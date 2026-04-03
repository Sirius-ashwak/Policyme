import { NextRequest, NextResponse } from "next/server";
import {
    createManagerReport,
    listManagerReports,
    type ManagerReportCategory,
} from "@/lib/demo-store";

const RUNTIME_ENV = (process.env.APP_ENV || process.env.NODE_ENV || "local").toLowerCase();
const DEMO_ALLOWED =
    RUNTIME_ENV === "local" ||
    RUNTIME_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function GET() {
    if (!DEMO_ALLOWED) {
        return NextResponse.json(
            { error: "Manager reports demo endpoint is disabled outside local/demo mode." },
            { status: 501 }
        );
    }

    return NextResponse.json(
        { reports: listManagerReports() },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    if (!DEMO_ALLOWED) {
        return NextResponse.json(
            { error: "Manager reports demo endpoint is disabled outside local/demo mode." },
            { status: 501 }
        );
    }

    const payload = (await req.json().catch(() => ({}))) as { category?: ManagerReportCategory };
    const category = payload.category;

    if (
        category !== undefined &&
        category !== "policies" &&
        category !== "compliance" &&
        category !== "searches" &&
        category !== "conflicts"
    ) {
        return NextResponse.json(
            { error: "Unsupported report category." },
            { status: 400 }
        );
    }

    const report = createManagerReport(category);

    return NextResponse.json(
        {
            report,
            reports: listManagerReports(),
        },
        { status: 201 }
    );
}
