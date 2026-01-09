const Premium = require("@schemas/Premium");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "cleanup",
  description: "limpar códigos premium expirados",
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
      return message.safeReply("Apenas proprietários do bot podem limpar códigos premium.");
    }

    const response = await cleanupExpiredCodes();
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem limpar códigos premium.");
    }

    const response = await cleanupExpiredCodes();
    return interaction.followUp(response);
  },
};

async function cleanupExpiredCodes() {
  try {
    const result = await Premium.deleteMany({
      expiresAt: { $lt: new Date() },
      userId: null
    });

    return `🧹 Limpeza concluída! ${result.deletedCount} códigos expirados removidos.`;
  } catch (error) {
    return "❌ Erro ao limpar códigos expirados.";
  }
}