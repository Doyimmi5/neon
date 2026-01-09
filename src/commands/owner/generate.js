const { ApplicationCommandOptionType } = require("discord.js");
const { generatePremiumCode } = require("@handlers/premium");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "generate",
  description: "gerar código premium",
  category: "OWNER",
  command: {
    enabled: true,
    usage: "[dias]",
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "days",
        description: "número de dias de premium",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários do bot podem gerar códigos premium.");
    }

    const days = parseInt(args[0]) || 30;
    if (days < 1 || days > 365) {
      return message.safeReply("Dias deve ser entre 1 e 365.");
    }

    try {
      const code = await generatePremiumCode(days);
      return message.safeReply(`Código premium gerado: \`${code}\`\nVálido por: ${days} dias`);
    } catch (error) {
      return message.safeReply("Erro ao gerar código premium.");
    }
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem gerar códigos premium.");
    }

    const days = interaction.options.getInteger("days") || 30;
    if (days < 1 || days > 365) {
      return interaction.followUp("Dias deve ser entre 1 e 365.");
    }

    try {
      const code = await generatePremiumCode(days);
      return interaction.followUp(`Código premium gerado: \`${code}\`\nVálido por: ${days} dias`);
    } catch (error) {
      return interaction.followUp("Erro ao gerar código premium.");
    }
  },
};