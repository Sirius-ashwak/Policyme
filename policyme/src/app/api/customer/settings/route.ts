import { NextRequest, NextResponse } from "next/server";
import { type CustomerSettingId } from "@/lib/demo-store";
import {
    listCustomerSettingsRepository,
    runCustomerSettingActionRepository,
} from "@/lib/supabase-repository";

export async function GET() {
    const result = await listCustomerSettingsRepository();

    return NextResponse.json(
        {
            settings: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    const payload = (await req.json().catch(() => ({}))) as { settingId?: CustomerSettingId };

    if (
        payload.settingId !== "password" &&
        payload.settingId !== "twofa" &&
        payload.settingId !== "notifications" &&
        payload.settingId !== "privacy"
    ) {
        return NextResponse.json(
            { error: "Unsupported setting action." },
            { status: 400 }
        );
    }

    const result = await runCustomerSettingActionRepository(payload.settingId);

    return NextResponse.json(
        {
            settings: result.data,
            source: result.source,
            warning: result.warning,
            details: result.details,
        },
        { status: 200 }
    );
}
