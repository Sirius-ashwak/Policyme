import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/config/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const supabase = getSupabaseAdminClient();
        
        // Parse timeframe from URL
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get("timeframe") || "24H";
        
        // Calculate the target date threshold based on timeframe
        const now = new Date();
        let thresholdDate = new Date();
        
        if (timeframe === "24H") {
            thresholdDate.setHours(now.getHours() - 24);
        } else if (timeframe === "7D") {
            thresholdDate.setDate(now.getDate() - 7);
        } else if (timeframe === "30D") {
            thresholdDate.setDate(now.getDate() - 30);
        } else {
            // "Custom" or unknown, we'll arbitrarily use 30 days for now or no filter.
            // Let's use 30 days as a generous default to avoid pulling the whole DB
            thresholdDate.setDate(now.getDate() - 30);
        }

        const thresholdIsoString = thresholdDate.toISOString();

        // 1. Fetch Performance Metrics
        const { data: metrics, error: metricsError } = await supabase
            .from("ai_performance_metrics")
            .select("*")
            .gte("metric_date", thresholdIsoString)
            .order("metric_date", { ascending: true });

        if (metricsError) throw metricsError;

        // 2. Fetch Hallucination Risks
        const { data: risks, error: risksError } = await supabase
            .from("ai_hallucination_risks")
            .select("*")
            .gte("flagged_at", thresholdIsoString)
            .order("flagged_at", { ascending: false });

        if (risksError) throw risksError;

        // 3. Fetch Training Status
        const { data: trainingStatus, error: trainingError } = await supabase
            .from("ai_model_training_status")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (trainingError && trainingError.code !== "PGRST116") { // PGRST116 = no rows returned
            throw trainingError;
        }

        return NextResponse.json({
            metrics,
            risks,
            trainingStatus
        });
    } catch (error: any) {
        console.error("AI Analytics API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
