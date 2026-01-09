const { ApplicationCommandOptionType } = require("discord.js");
const { redeemPremiumCode } = require("@handlers/premium");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "redeem",
  description: "resgatar código premium",
  category: "PREMIUM",
  command: {
    enabled: true,
    usage: "<código>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "code",
        description: "código premium para resgatar",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const code = args[0];
    if (!code) {
      return message.safeReply("Por favor, forneça um código premium.");
    }

    try {
      const result = await redeemPremiumCode(code, message.author.id);
      return message.safeReply(result.message);
    } catch (error) {
      return message.safeReply("Erro ao resgatar código premium.");
    }
  },

  async interactionRun(interaction) {
    const code = interaction.options.getString("code");

    try {
      const result = await redeemPremiumCode(code, interaction.user.id);
      return interaction.followUp(result.message);
    } catch (error) {
      return interaction.followUp("Erro ao resgatar código premium.");
    }
  },
};