const { EmbedBuilder } = require("discord.js");
const Premium = require("@schemas/Premium");
const { EMBED_COLORS, OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "stats",
  description: "estatísticas do sistema premium",
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
      return message.safeReply("Apenas proprietários do bot podem ver estatísticas premium.");
    }

    const response = await getPremiumStats();
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem ver estatísticas premium.");
    }

    const response = await getPremiumStats();
    return interaction.followUp(response);
  },
};

async function getPremiumStats() {
  const totalCodes = await Premium.countDocuments();
  const activePremium = await Premium.countDocuments({
    userId: { $ne: null },
    expiresAt: { $gt: new Date() }
  });
  const redeemedCodes = await Premium.countDocuments({ userId: { $ne: null } });
  const expiredCodes = await Premium.countDocuments({ expiresAt: { $lt: new Date() } });
  const availableCodes = await Premium.countDocuments({
    userId: null,
    expiresAt: { $gt: new Date() }
  });

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("📊 Estatísticas Premium")
    .addFields(
      { name: "📋 Total de Códigos", value: totalCodes.toString(), inline: true },
      { name: "👑 Usuários Premium Ativos", value: activePremium.toString(), inline: true },
      { name: "✅ Códigos Resgatados", value: redeemedCodes.toString(), inline: true },
      { name: "⏳ Códigos Disponíveis", value: availableCodes.toString(), inline: true },
      { name: "❌ Códigos Expirados", value: expiredCodes.toString(), inline: true },
      { name: "📈 Taxa de Uso", value: `${totalCodes > 0 ? Math.round((redeemedCodes / totalCodes) * 100) : 0}%`, inline: true }
    )
    .setTimestamp();

  return { embeds: [embed] };
}