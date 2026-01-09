const { ApplicationCommandOptionType } = require("discord.js");
const Premium = require("@schemas/Premium");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "revoke",
  description: "revogar premium de um usuário",
  category: "OWNER",
  command: {
    enabled: true,
    usage: "<@usuário>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "user",
        description: "usuário para revogar premium",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários do bot podem revogar premium.");
    }

    const target = message.mentions.users.first();
    if (!target) {
      return message.safeReply("Por favor, mencione um usuário.");
    }

    const response = await revokePremium(target.id);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem revogar premium.");
    }

    const target = interaction.options.getUser("user");
    const response = await revokePremium(target.id);
    return interaction.followUp(response);
  },
};

async function revokePremium(userId) {
  try {
    const premium = await Premium.findOne({
      userId,
      expiresAt: { $gt: new Date() },
      redeemedAt: { $ne: null }
    });

    if (!premium) {
      return "❌ Usuário não possui premium ativo.";
    }

    premium.expiresAt = new Date();
    await premium.save();

    return "✅ Premium revogado com sucesso!";
  } catch (error) {
    return "❌ Erro ao revogar premium.";
  }
}