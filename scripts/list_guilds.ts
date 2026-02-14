import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config({ path: ".env.local" });
const DISCORD_BOT_TOKEN = env.DISCORD_TOKEN;

async function listGuilds() {
  console.log("Fetching guilds for the bot...");
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch guilds:", await response.text());
    return;
  }

  const guilds = await response.json();
  console.log("\n--- GUILDS LIST ---");
  guilds.forEach((g: any) => {
    console.log(`- ${g.name} (ID: ${g.id})`);
  });
  console.log("-------------------\n");
}

listGuilds();
