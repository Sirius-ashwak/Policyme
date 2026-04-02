import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error("Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL).");
    }

    if (!serviceRoleKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for server-side admin queries.");
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
