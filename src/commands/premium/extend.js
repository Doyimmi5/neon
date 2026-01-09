const { ApplicationCommandOptionType } = require("discord.js");
const Premium = require("@schemas/Premium");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "extend",
  description: "estender premium de um usuário",
  category: "OWNER",
  command: {
    enabled: true,
    usage: "<@usuário> <dias>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "user",
        description: "usuário para estender premium",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "days",
        description: "dias para adicionar",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários do bot podem estender premium.");
    }

    const target = message.mentions.users.first();
    const days = parseInt(args[1]);

    if (!target) return message.safeReply("Mencione um usuário.");
    if (!days || days < 1 || days > 365) return message.safeReply("Dias deve ser entre 1 e 365.");

    const response = await extendPremium(target.id, days);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários do bot podem estender premium.");
    }

    const target = interaction.options.getUser("user");
    const days = interaction.options.getInteger("days");

    if (days < 1 || days > 365) {
      return interaction.followUp("Dias deve ser entre 1 e 365.");
    }

    const response = await extendPremium(target.id, days);
    return interaction.followUp(response);
  },
};

async function extendPremium(userId, days) {
  try {
    const premium = await Premium.findOne({
      userId,
      expiresAt: { $gt: new Date() },
      redeemedAt: { $ne: null }
    });

    if (!premium) {
      return "❌ Usuário não possui premium ativo.";
    }

    premium.expiresAt.setDate(premium.expiresAt.getDate() + days);
    await premium.save();

    return `✅ Premium estendido por ${days} dias!`;
  } catch (error) {
    return "❌ Erro ao estender premium.";
  }
}