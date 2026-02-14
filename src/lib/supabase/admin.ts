
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
    const serviceRoleKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY;

    if (!serviceRoleKey) {
        throw new Error(
            "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)."
        );
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
