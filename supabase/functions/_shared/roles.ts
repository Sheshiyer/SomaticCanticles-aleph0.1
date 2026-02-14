export const ROLES = {
  Neophyte: "1472111792745611369",
  Resonant: "1472112069376741492",
  Architect: "1472112274482266206"
};

export const GUILD_ID = "1467389125999988944";

export async function addRoleToUser(discordId: string, roleId: string, botToken: string) {
  console.log(`Adding role ${roleId} to user ${discordId}`);
  
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to assign role: ${errorText}`);
    throw new Error(`Failed to assign role: ${errorText}`);
  }

  console.log(`Role ${roleId} assigned successfully.`);
}
