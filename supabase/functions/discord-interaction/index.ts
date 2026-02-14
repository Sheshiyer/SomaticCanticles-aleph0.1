// Setup type definitions for Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nacl from "https://esm.sh/tweetnacl@1.0.3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { createTechFrameEmbed } from "../_shared/embeds.ts";
import { calculateBiorhythm, generateProgressBar } from "../_shared/biorhythm.ts";
import { addRoleToUser, ROLES } from "../_shared/roles.ts";
import { getCodonResult } from "../_shared/codons.ts";

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

  // 2. Check User Progress for this Chapter
  const { data: progress } = await supabase
    .from('user_progress')
    .select('unlocked_at, completed_at, chapters ( id, title, subtitle, audio_url, cycle )')
    .eq('user_id', user.id)
    .eq('chapter_id', parseInt(chapterId))
    .single();

  const bio = calculateBiorhythm(new Date(user.birthdate || new Date()));
  const bioValue = progress?.chapters?.cycle ? bio[progress.chapters.cycle as keyof typeof bio] : 0;
  const bioPercent = typeof bioValue === 'number' ? Math.round(bioValue * 100) : 0;

  // 3. Handle Locked State
  if (!progress || !progress.unlocked_at) {
     const embed = createTechFrameEmbed(
      "Signal Locked",
      `Your biorhythm is vibrating, but this frequency is not yet attuned.`,
      "error"
    );
    embed.fields = [
      {
         name: "Current Resonance",
         value: `${progress?.chapters?.cycle || 'Unknown'} Cycle: ${bioPercent}%`,
         inline: true
      },
      {
        name: "Status",
        value: "🔒 Sealed via Anamnesis",
        inline: true
      }
    ];
    return { embeds: [embed], flags: 64 };
  }

  // 4. Handle Unlocked State
  const chapter = progress.chapters;
  // @ts-ignore - Drizzle types might differ from Supabase JSON response
  const audioUrl = chapter?.audio_url || "https://somatic-canticles.com/dashboard";

  const embed = createTechFrameEmbed(
    `Canticle ${chapterId}: ${chapter?.title}`,
    chapter?.subtitle || "Transmission received.",
    "success"
  );
  
  embed.fields = [
    {
      name: "Resonance Frequency",
      value: `${chapter?.cycle?.toUpperCase()} Cycle: ${bioPercent}% \`${generateProgressBar(typeof bioValue === 'number' ? bioValue : 0, 5)}\``,
      inline: false
    },
    {
      name: "Artifact Unlocked",
      value: `[🎧 Listen to Transmission](${audioUrl})`,
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

      // Auto-assign Neophyte role on calibration attempt
      try {
        await addRoleToUser(discordId!, ROLES.Neophyte, Deno.env.get("DISCORD_TOKEN")!);
      } catch (e) {
        console.error("Failed to assign role:", e);
      }

      return new Response(JSON.stringify({
        type: 4,
        data: {
          content: `**Somatic Oracle**\n\nSomanaut detected. Initiate signal handshake.\n\nEnter this Calibration Key in your dashboard Settings:\n# \`${otp}\`\n\n*This key expires in 5 minutes.*`,
          flags: 64
        }
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (name === "status") {
      const discordId = interaction.member?.user.id;
      if (!discordId) return new Response("User not found", { status: 400 });

      // Check if user is linked
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: user } = await supabase.from('users').select('birthdate').eq('discord_id', discordId).single();

      if (!user || !user.birthdate) {
        return new Response(JSON.stringify({
          type: 4,
          data: {
            content: "❌ **Signal Lost.**\n\nYou are not linked to the Anamnesis Engine, or your birthdate is missing.\nRun `/calibrate` to establish a connection.",
            flags: 64
          }
        }), { headers: { "Content-Type": "application/json" } });
      }

      // Calculate Biorhythm
      const bio = calculateBiorhythm(new Date(user.birthdate));

      // Create Embed
      const embed = createTechFrameEmbed(
        "Current Biometric Status",
        `Real-time harmonic analysis for <@${discordId}>.`
      );

      embed.fields = [
        {
          name: "Physical // " + bio.labels.physical,
          value: `\`${generateProgressBar(bio.physical)}\` ${Math.round(bio.physical * 100)}%`,
          inline: false
        },
        {
          name: "Emotional // " + bio.labels.emotional,
          value: `\`${generateProgressBar(bio.emotional)}\` ${Math.round(bio.emotional * 100)}%`,
          inline: false
        },
        {
          name: "Intellectual // " + bio.labels.intellectual,
          value: `\`${generateProgressBar(bio.intellectual)}\` ${Math.round(bio.intellectual * 100)}%`,
          inline: false
        }
      ];

      return new Response(JSON.stringify({
        type: 4,
        data: {
          embeds: [embed],
          flags: 64
        }
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (name === "dispatch") {
      const options = interaction.data?.options;
      const chapterOption = options?.find(o => o.name === "chapter");
      
      if (!chapterOption || typeof chapterOption.value !== 'number') {
         return new Response(JSON.stringify({
            type: 4,
            data: { content: "Invalid chapter number.", flags: 64 }
         }), { headers: { "Content-Type": "application/json" } });
      }

      const chapterId = chapterOption.value;
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Fetch Chapter Data
      const { data: chapter, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single();

      if (error || !chapter) {
         return new Response(JSON.stringify({
            type: 4,
            data: { content: `**Error:** Chapter ${chapterId} not found in the archives.`, flags: 64 }
         }), { headers: { "Content-Type": "application/json" } });
      }

      // Create Witness Card
      const embed = createTechFrameEmbed(
        `Canticle ${chapterId}: ${chapter.title}`,
        chapter.description || "The signal is waiting to be witnessed.",
        "default"
      );

      embed.fields = [
        {
          name: "Resonance Cycle",
          value: `\`${chapter.cycle ? chapter.cycle.toUpperCase() : "UNKNOWN"}\``,
          inline: true
        },
        {
          name: "Duration",
          value: `${chapter.duration_minutes || "??"} mins`,
          inline: true
        }
      ];

      return new Response(JSON.stringify({
        type: 4,
        data: {
          embeds: [embed],
          components: [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2, // Button
                  style: 1, // Primary (Blurple)
                  label: "👁️ Witness",
                  custom_id: `witness_${chapterId}`
                }
              ]
            }
          ]
        }
      }), { headers: { "Content-Type": "application/json" } });
    }
    if (name === "codex") {
      const options = interaction.data?.options;
      const sequenceOption = options?.find(o => o.name === "sequence");
      
      if (!sequenceOption || typeof sequenceOption.value !== 'string') {
        return new Response(JSON.stringify({
          type: 4,
          data: { content: "Sequence required (e.g., AUG).", flags: 64 }
        }), { headers: { "Content-Type": "application/json" } });
      }

      const sequence = sequenceOption.value.toUpperCase();

      try {
        const result = getCodonResult(sequence);
        
        const embed = createTechFrameEmbed(
          `Codex Analysis: ${sequence}`,
          result.description,
          result.isSpecial ? "success" : "default"
        );

        embed.fields = [
          {
            name: "Amino Acid",
            value: result.aminoAcid,
            inline: true
          },
          {
            name: "Resonance",
            value: result.resonance,
            inline: true
          },
          {
            name: "Frequency",
            value: `${result.frequency} Hz`,
            inline: true
          }
        ];

        return new Response(JSON.stringify({
            type: 4,
            data: { embeds: [embed] }
        }), { headers: { "Content-Type": "application/json" } });

      } catch (err: any) {
         return new Response(JSON.stringify({
            type: 4,
            data: { 
                content: `**Synthesis Failure:** ${err.message}`, 
                flags: 64 
            }
         }), { headers: { "Content-Type": "application/json" } });
      }
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
