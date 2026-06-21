// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Look for either NEXT_PUBLIC_ or raw SUPABASE_URL variables to ensure safety
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
    console.warn("Supabase Warning: Supabase URL environment variable is not configured.");
}

export const supabase = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);