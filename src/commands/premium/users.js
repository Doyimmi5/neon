const { EmbedBuilder } = require("discord.js");
const Premium = require("@schemas/Premium");
const { EMBED_COLORS, OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "users",
  description: "listar usuários premium",
  category: "OWNER",
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
  },

  async messageRun(message) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários do bot podem listar usuários premium.");
    }

    const response = await listPremiumUsers(message.client);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem listar usuários premium.");
    }

    const response = await listPremiumUsers(interaction.client);
    return interaction.followUp(response);
  },
};

async function listPremiumUsers(client) {
  const premiumUsers = await Premium.find({
    userId: { $ne: null },
    expiresAt: { $gt: new Date() },
    redeemedAt: { $ne: null }
  }).sort({ expiresAt: 1 });

  if (premiumUsers.length === 0) {
    return "Nenhum usuário premium ativo encontrado.";
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("👑 Usuários Premium Ativos")
    .setTimestamp();

  let description = "";
  for (const premium of premiumUsers.slice(0, 10)) {
    try {
      const user = await client.users.fetch(premium.userId);
      const daysLeft = Math.ceil((premium.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
      description += `**${user.username}** - ${daysLeft} dias restantes\n`;
    } catch (error) {
      description += `**ID: ${premium.userId}** - ${Math.ceil((premium.expiresAt - new Date()) / (1000 * 60 * 60 * 24))} dias\n`;
    }
  }

  if (premiumUsers.length > 10) {
    description += `\n... e mais ${premiumUsers.length - 10} usuários`;
  }

  embed.setDescription(description);
  embed.setFooter({ text: `Total: ${premiumUsers.length} usuários premium` });

  return { embeds: [embed] };
}