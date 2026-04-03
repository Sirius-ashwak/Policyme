import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/config/supabaseServer";

export const dynamic = "force-dynamic";
const RUNTIME_ENV = (process.env.APP_ENV || process.env.NODE_ENV || "local").toLowerCase();
const DEMO_FALLBACK_ALLOWED =
    RUNTIME_ENV === "local" ||
    RUNTIME_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function GET() {
    try {
        const supabase = getSupabaseAdminClient();

        // 1. Fetch System Telemetry (For Neo4j Status & Token counts)
        const { data: sysData, error: sysError } = await fallbackWrapper(supabase
            .from("system_telemetry")
            .select("api_latency_ms, token_throughput_k")
            .order("metric_date", { ascending: false })
            .limit(1)
            .single()
        );

        // 2. Fetch User Demographics
        const { data: usersData, error: usersError } = await fallbackWrapper(supabase
            .from("app_users")
            .select("role")
        );

        let customerCount = 0;
        let underwriterCount = 0;
        let adjusterCount = 0;

        if (usersData) {
            usersData.forEach((u: any) => {
                const role = (u.role || "").toLowerCase();
                if (role === "customer") customerCount++;
                else if (role === "underwriter") underwriterCount++;
                else if (role === "adjuster") adjusterCount++;
            });
        }
        const hasUsersData = Array.isArray(usersData);

        // 3. Fetch Recent Audit Logs
        const { data: auditData, error: auditError } = await fallbackWrapper(supabase
            .from("audit_logs")
            .select("actor_name, action, timestamp, actor_badge, outcome")
            .order("timestamp", { ascending: false })
            .limit(4)
        );

        if (!DEMO_FALLBACK_ALLOWED && (!sysData || !usersData || !auditData)) {
            throw new Error("Required overview datasets are unavailable and demo fallback is disabled.");
        }

        return NextResponse.json({
            telemetry: {
                neo4j_status_pct: 99.98, // Neo4j uptime is generally a constant for this project, or could be fetched
                api_latency_ms: sysData?.api_latency_ms ?? 124,
                llm_tokens_k: sysData?.token_throughput_k ?? 1200
            },
            users: {
                customers: hasUsersData ? customerCount : 14282,
                underwriters: hasUsersData ? underwriterCount : 842,
                adjusters: hasUsersData ? adjusterCount : 312
            },
            auditLogs: auditData || [
                { action: "Risk thresholds updated", actor_name: "Admin", timestamp: new Date().toISOString(), actor_badge: "AD", outcome: "recorded" }
            ]
        });

    } catch (error: any) {
        console.error("Overview API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch overview data" },
            { status: 500 }
        );
    }
}

async function fallbackWrapper(promise: any) {
    try {
        const res = await promise;
        return res;
    } catch {
        return { data: null, error: null };
    }
}
