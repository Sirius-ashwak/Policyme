import { NextResponse } from "next/server";
import { listCustomerPoliciesRepository } from "@/lib/supabase-repository";

export async function GET() {
    const result = await listCustomerPoliciesRepository();

    return NextResponse.json(
        {
            policies: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}
