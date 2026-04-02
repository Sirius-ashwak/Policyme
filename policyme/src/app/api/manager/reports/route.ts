import { NextRequest, NextResponse } from "next/server";
import {
    createManagerReport,
    listManagerReports,
    type ManagerReportCategory,
} from "@/lib/demo-store";

export async function GET() {
    return NextResponse.json(
        { reports: listManagerReports() },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
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
