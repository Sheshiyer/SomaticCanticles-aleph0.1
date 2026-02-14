
// Sunrise Protocol - Daily Biorhythm Dispatch
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { calculateBiorhythm, generateProgressBar } from "../_shared/biorhythm.ts";
import { createTechFrameEmbed, COLORS } from "../_shared/embeds.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_BOT_TOKEN = Deno.env.get("DISCORD_TOKEN")!;

serve(async (req) => {
  // secure cron invocation (optional check for specific header if needed)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Fetch Users wanting updates
  const { data: users, error } = await supabase
    .from("users")
    .select("id, discord_id, birthdate")
    .not("discord_id", "is", null)
    .eq("discord_listening", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ message: "No users to update" }), { status: 200 });
  }

  console.log(`Sunrise Protocol: Dispatching to ${users.length} users.`);

  let successCount = 0;
  const errors: any[] = [];

  // 2. Iterate and Send
  for (const user of users) {
    try {
      if (!user.birthdate) continue; // Skip if no birthdate

      const bio = calculateBiorhythm(new Date(user.birthdate));

      // Construct Embed
      const embed = createTechFrameEmbed(
        "Daily Biorhythm Analysis",
        `Sun cycle initialization complete. Current harmonics for <@${user.discord_id}>:`
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

      // 3. Send DM via Discord API
      // First create DM channel
      const dmChannelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
        method: "POST",
        headers: {
          "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ recipient_id: user.discord_id })
      });

      if (!dmChannelRes.ok) {
        const err = await dmChannelRes.json();
        throw new Error(`Failed to open DM: ${JSON.stringify(err)}`);
      }

      const dmChannel = await dmChannelRes.json();
      const channelId = dmChannel.id;

      // Send Message
      const msgRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      });

      if (!msgRes.ok) {
        const err = await msgRes.json();
        // Handle 403 (User disabled DMs) - maybe update DB to stop listening?
        throw new Error(`Failed to send DM: ${JSON.stringify(err)}`);
      }

      // 4. Update Dispatch Timestamp
      await supabase.from("users").update({
        last_oracle_dispatch: new Date().toISOString()
      }).eq("id", user.id);

      successCount++;

      // Rate limit safety - minimal delay
      await new Promise(r => setTimeout(r, 100));

    } catch (e: any) {
      console.error(`Failed for user ${user.id}:`, e);
      errors.push({ userId: user.id, error: e.message });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    dispatched: successCount,
    errors: errors.length
  }), {
    headers: { "Content-Type": "application/json" }
  });
});
