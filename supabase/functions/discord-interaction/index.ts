// Setup type definitions for Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nacl from "https://esm.sh/tweetnacl@1.0.3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { createTechFrameEmbed } from "../_shared/embeds.ts";
import { calculateBiorhythm, generateProgressBar } from "../_shared/biorhythm.ts";

// Define Types
interface APIInteraction {
  id: string;
  type: number;
  data?: {
    name: string;
    custom_id?: string; // For buttons
    options?: { name: string; value: string | number }[];
  };
  member?: {
    user: {
      id: string;
      username: string;
      discriminator: string;
    };
  };
}

// Environment Variables
const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Verify Signature Middleware
function verifySignature(request: Request): Promise<{ valid: boolean; body: string }> {
  return new Promise(async (resolve) => {
    const signature = request.headers.get("X-Signature-Ed25519")!;
    const timestamp = request.headers.get("X-Signature-Timestamp")!;
    const body = await request.text();

    if (!signature || !timestamp || !body) {
      resolve({ valid: false, body: "" });
      return;
    }

    const valid = nacl.sign.detached.verify(
      new TextEncoder().encode(timestamp + body),
      hexToUint8Array(signature),
      hexToUint8Array(DISCORD_PUBLIC_KEY)
    );

    resolve({ valid, body });
  });
}

function hexToUint8Array(hex: string) {
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16))
  );
}

function generateOTP(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 4) otp += "-";
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

async function storeOTP(discordId: string, otp: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await supabase.from('discord_otps').insert({
    code: otp,
    discord_id: discordId,
    expires_at: expiresAt
  });
}

async function handleWitness(discordId: string, chapterId: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Get User
  const { data: user } = await supabase.from('users').select('*').eq('discord_id', discordId).single();

  if (!user) {
    return {
      content: "Signal not found. Run `/calibrate` to link your Anamnesis Engine.",
      flags: 64
    };
  }

  // 2. Check Biorhythm (Mock Logic for now - ideally check logic per chapter)
  const bio = calculateBiorhythm(new Date(user.birthdate || new Date()));
  // Example: Unlock Chapter 1 if Physical > 0.2 (Low bar for intro)

  // In real app, check 'user_progress' or unlock rules.
  // For MVP, we assume Chapter 1 is "Calibration" -> Always unlock if linked.

  // Unlock Content
  // Update DB (Mock)
  // await supabase.from('user_progress').insert(...)

  const embed = createTechFrameEmbed(
    "Canticle I: The Body Electric",
    "Connection established. The somatic bridge is stable.",
    "success"
  );
  embed.fields = [
    {
      name: "Vibration Analyzed",
      value: `Physical Cycle: ${Math.round(bio.physical * 100)}% \`${generateProgressBar(bio.physical, 5)}\``,
      inline: true
    },
    {
      name: "Artifact Unlocked",
      value: "[Access Transmission >>](https://somatic-canticles.com/chapter/1)",
      inline: false
    }
  ];

  return {
    embeds: [embed],
    flags: 64
  };
}

serve(async (req) => {
  const { valid, body } = await verifySignature(req);
  if (!valid) return new Response("Invalid request signature", { status: 401 });

  const interaction: APIInteraction = JSON.parse(body);

  if (interaction.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), { headers: { "Content-Type": "application/json" } });
  }

  // Handle Slash Commands
  if (interaction.type === 2) {
    const { name } = interaction.data!;

    if (name === "calibrate") {
      const discordId = interaction.member?.user.id;
      const otp = generateOTP();
      await storeOTP(discordId!, otp);
      return new Response(JSON.stringify({
        type: 4,
        data: {
          content: `**Somatic Oracle**\n\nSomanaut detected. Initiate signal handshake.\n\nEnter this Calibration Key in your dashboard Settings:\n# \`${otp}\`\n\n*This key expires in 5 minutes.*`,
          flags: 64
        }
      }), { headers: { "Content-Type": "application/json" } });
    }
  }

  // Handle Component Interactions (Buttons)
  if (interaction.type === 3) {
    const { custom_id } = interaction.data!;
    const discordId = interaction.member?.user.id!;

    if (custom_id?.startsWith("witness_")) {
      const chapterId = custom_id.replace("witness_", "");
      const responseData = await handleWitness(discordId, chapterId);

      return new Response(JSON.stringify({
        type: 4,
        data: responseData
      }), { headers: { "Content-Type": "application/json" } });
    }
  }

  return new Response("Bad Request", { status: 400 });
});
