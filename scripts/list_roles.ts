import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Load environment variables
const env = config({ path: ".env.local" });
const DISCORD_BOT_TOKEN = env.DISCORD_TOKEN;
const DISCORD_GUILD_ID = env.DISCORD_GUILD_ID;

if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
  console.error("Missing DISCORD_TOKEN or DISCORD_GUILD_ID");
  Deno.exit(1);
}

async function listRoles() {
  console.log(`Fetching roles for Guild: ${DISCORD_GUILD_ID}...`);
  
  const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/roles`, {
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch roles:", await response.text());
    return;
  }

  const roles = await response.json();
  
  console.log("\n--- ROLES LIST ---");
  roles.sort((a: any, b: any) => b.position - a.position); // Sort by position (hierarchy)
  
  roles.forEach((role: any) => {
    console.log(`[${role.position}] ${role.name} (ID: ${role.id}) ${role.managed ? "[MANAGED/BOT]" : ""}`);
  });
  console.log("------------------\n");
}

listRoles();
