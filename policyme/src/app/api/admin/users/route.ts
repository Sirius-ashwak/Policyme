import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/config/supabaseServer";
import { listAdminUsers } from "@/lib/demo-store";

type AppUserRow = {
    id: string;
    full_name: string | null;
    email: string;
    role: string | null;
    department: string | null;
    status: string | null;
    last_activity_at: string | null;
};

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

function parseLimit(req: NextRequest): number {
    const raw = req.nextUrl.searchParams.get("limit");
    if (!raw) {
        return DEFAULT_LIMIT;
    }

    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return DEFAULT_LIMIT;
    }

    return Math.min(parsed, MAX_LIMIT);
}

function fallbackName(email: string): string {
    const localPart = email.split("@")[0];
    if (!localPart) {
        return "Unknown User";
    }

    return localPart
        .split(/[._-]/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
}

function mapRole(role: string | null): string {
    if (!role) {
        return "Unassigned";
    }

    return role
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function GET(req: NextRequest) {
    try {
        const limit = parseLimit(req);
        const supabase = getSupabaseAdminClient();

        const { data, error } = await supabase
            .from("app_users")
            .select("id, full_name, email, role, department, status, last_activity_at")
            .order("last_activity_at", { ascending: false, nullsFirst: false })
            .limit(limit);

        if (error) {
            throw new Error(`Supabase query failed: ${error.message}`);
        }

        const users = (data as AppUserRow[] | null)?.map((user) => ({
            id: user.id,
            name: user.full_name || fallbackName(user.email),
            email: user.email,
            role: mapRole(user.role),
            department: user.department || "Organization",
            status: user.status || "Active",
            lastActivityAt: user.last_activity_at,
        })) || [];

        return NextResponse.json({ users, source: "supabase" }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Supabase admin users API error:", message);

        return NextResponse.json(
            {
                users: listAdminUsers(),
                source: "demo",
                warning: "Supabase admin users unavailable. Serving demo data instead.",
                details: message,
            },
            { status: 200 }
        );
    }
}
