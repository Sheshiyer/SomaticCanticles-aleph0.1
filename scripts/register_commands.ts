
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

if (!clientId || !token || !guildId) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("calibrate")
    .setDescription("Initialize connection with the Anamnesis Engine (Generates OTP)"),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check your connection status with the Oracle"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Register Guild Commands (Instant update)
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`Successfully reloaded ${commands.length} application (/) commands for Guild ${guildId}.`);
    
    // Also try Global (takes up to 1 hour)
    // await rest.put(Routes.applicationCommands(clientId), { body: commands });

  } catch (error) {
    console.error(error);
  }
})();
