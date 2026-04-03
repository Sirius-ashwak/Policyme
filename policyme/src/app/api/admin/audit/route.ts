import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getSupabaseAdminClient } from "@/config/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
        });

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = typeof token.role === "string" ? token.role.toLowerCase() : "";
        if (role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const supabase = getSupabaseAdminClient();

        // 1. Fetch Metrics
        const { data: metrics, error: metricsError } = await supabase
            .from("audit_metrics")
            .select("*")
            .eq("id", "global_metrics")
            .single();

        if (metricsError && metricsError.code !== "PGRST116") throw metricsError;

        // 2. Fetch Logs
        const { data: logs, error: logsError } = await supabase
            .from("audit_logs")
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(100);

        if (logsError) throw logsError;

        const formattedMetrics = metrics ? {
            authEvents: metrics.auth_events,
            graphWrites: metrics.graph_writes,
            overrides: metrics.overrides,
            anomalies: metrics.anomalies,
            totalEntries: metrics.total_entries
        } : {
            authEvents: 0, graphWrites: 0, overrides: 0, anomalies: 0, totalEntries: 0
        };

        const formattedLogs = logs?.map((log) => ({
            sequence: log.sequence.toString(),
            timestamp: log.timestamp,
            timezoneLabel: log.timezone_label,
            actorName: log.actor_name,
            actorKind: log.actor_kind,
            actorMeta: log.actor_meta,
            actorBadge: log.actor_badge,
            action: log.action,
            hash: log.hash,
            statusLabel: log.status_label,
            outcome: log.outcome,
            anomaly: log.anomaly
        })) || [];

        return NextResponse.json({
            metrics: formattedMetrics,
            logs: formattedLogs
        });
    } catch (error: any) {
        console.error("Audit API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch audit data" },
            { status: 500 }
        );
    }
}
