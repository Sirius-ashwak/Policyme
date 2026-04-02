import { NextResponse } from "next/server";
import { getAuditMetrics, listAuditLogs } from "@/lib/demo-store";

export async function GET() {
    return NextResponse.json(
        {
            metrics: getAuditMetrics(),
            logs: listAuditLogs(),
        },
        { status: 200 }
    );
}
