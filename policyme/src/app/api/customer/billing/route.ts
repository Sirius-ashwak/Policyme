import { NextRequest, NextResponse } from "next/server";
import {
    getCustomerBillingRepository,
    payCustomerBillingRepository,
    refreshCustomerPaymentMethodRepository,
} from "@/lib/supabase-repository";

type BillingAction = "pay_now" | "update_method";

export async function GET() {
    const result = await getCustomerBillingRepository();

    return NextResponse.json(
        {
            billing: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    const payload = (await req.json().catch(() => ({}))) as { action?: BillingAction };

    if (payload.action === "pay_now") {
        const result = await payCustomerBillingRepository();
        return NextResponse.json(
            {
                billing: result.data,
                source: result.source,
                warning: result.warning,
                details: result.details,
            },
            { status: 200 }
        );
    }

    if (payload.action === "update_method") {
        const result = await refreshCustomerPaymentMethodRepository();
        return NextResponse.json(
            {
                billing: result.data,
                source: result.source,
                warning: result.warning,
                details: result.details,
            },
            { status: 200 }
        );
    }

    return NextResponse.json(
        { error: "Unsupported billing action." },
        { status: 400 }
    );
}
