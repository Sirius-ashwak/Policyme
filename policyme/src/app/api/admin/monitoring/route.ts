import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/config/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const supabase = getSupabaseAdminClient();
        
        // Parse timeRange from URL
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get("timeRange") || "24h";
        
        // Calculate the target date threshold
        const now = new Date();
        let thresholdDate = new Date();
        
        if (timeRange === "24h") {
            thresholdDate.setHours(now.getHours() - 24);
        } else if (timeRange === "7d") {
            thresholdDate.setDate(now.getDate() - 7);
        } else if (timeRange === "30d") {
            thresholdDate.setDate(now.getDate() - 30);
        }

        const thresholdIsoString = thresholdDate.toISOString();

        // 1. Fetch System Telemetry (latest record)
        const { data: systemData, error: sysError } = await supabase
            .from("system_telemetry")
            .select("*")
            .order("metric_date", { ascending: false })
            .limit(1)
            .single();

        if (sysError && sysError.code !== "PGRST116") throw sysError;

        // 2. Fetch Graph Telemetry (latest record)
        const { data: graphData, error: graphError } = await supabase
            .from("graph_telemetry")
            .select("*")
            .order("metric_date", { ascending: false })
            .limit(1)
            .single();

        if (graphError && graphError.code !== "PGRST116") throw graphError;

        // 3. Fetch Infrastructure Logs with date filter
        const { data: logs, error: logsError } = await supabase
            .from("infrastructure_logs")
            .select("*")
            .gte("logged_at", thresholdIsoString)
            .order("logged_at", { ascending: false });

        if (logsError) throw logsError;

        return NextResponse.json({
            system: systemData || null,
            graph: graphData || null,
            logs: logs || []
        });
    } catch (error: any) {
        console.error("System Monitoring API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch monitoring data" },
            { status: 500 }
        );
    }
}
