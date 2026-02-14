
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const linkSchema = z.object({
    code: z.string().length(8),
});

export async function POST(req: NextRequest) {
    try {
        const supabaseUser = await createClient(); // User client for session check
        const { data: { user }, error: sessionError } = await supabaseUser.auth.getUser();

        if (sessionError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = linkSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
        }

        const { code } = result.data;
        const supabaseAdmin = createAdminClient();

        // 1. Verify OTP using Admin Client
        const { data: otpRecord, error: otpError } = await supabaseAdmin
            .from('discord_otps')
            .select('*')
            .eq('code', code)
            .single();

        if (otpError || !otpRecord) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
        }

        // Check expiry
        if (new Date(otpRecord.expires_at) < new Date()) {
            // Clean up expired
            await supabaseAdmin.from('discord_otps').delete().eq('code', code);
            return NextResponse.json({ error: "Code expired" }, { status: 400 });
        }

        // 2. Link User using Admin Client (bypassing RLS complexity)
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                discord_id: otpRecord.discord_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            // Handle unique constraint violation (if another user already linked this discord ID)
            if (updateError.code === '23505') { // Postgres unique violation
                return NextResponse.json({ error: "This Discord account is already linked to another user." }, { status: 409 });
            }
            throw updateError;
        }

        // 3. Cleanup OTP
        await supabaseAdmin.from('discord_otps').delete().eq('code', code);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Link error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabaseUser = await createClient(); // User verification
        const { data: { user }, error: sessionError } = await supabaseUser.auth.getUser();

        if (sessionError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseAdmin = createAdminClient(); // Admin for update

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                discord_id: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Unlink error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
