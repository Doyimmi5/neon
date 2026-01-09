const { EmbedBuilder } = require("discord.js");
const Premium = require("@schemas/Premium");
const { EMBED_COLORS, OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "list",
  description: "listar códigos premium",
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
      return message.safeReply("Apenas proprietários do bot podem listar códigos premium.");
    }

    const response = await listPremiumCodes();
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem listar códigos premium.");
    }

    const response = await listPremiumCodes();
    return interaction.followUp(response);
  },
};

async function listPremiumCodes() {
  const codes = await Premium.find().sort({ createdAt: -1 }).limit(10);
  
  if (codes.length === 0) {
    return "Nenhum código premium encontrado.";
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("📋 Códigos Premium (Últimos 10)")
    .setTimestamp();

  let description = "";
  for (const code of codes) {
    const status = code.userId ? "✅ Resgatado" : code.expiresAt < new Date() ? "❌ Expirado" : "⏳ Disponível";
    const daysLeft = Math.ceil((code.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
    description += `\`${code.code}\` - ${status} (${daysLeft}d)\n`;
  }

  embed.setDescription(description);
  return { embeds: [embed] };
}