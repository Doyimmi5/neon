const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { isPremiumUser } = require("@handlers/premium");
const Premium = require("@schemas/Premium");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "status",
  description: "verificar status premium",
  category: "PREMIUM",
  isPremium: true,
  command: {
    enabled: true,
    usage: "[@usuário]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "usuário para verificar status",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = message.mentions.users.first() || message.author;
    const response = await getPremiumStatus(target);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const response = await getPremiumStatus(target);
    return interaction.followUp(response);
  },
};

async function getPremiumStatus(user) {
  const premium = await Premium.findOne({
    userId: user.id,
    expiresAt: { $gt: new Date() },
    redeemedAt: { $ne: null }
  });

  const embed = new EmbedBuilder()
    .setColor(premium ? EMBED_COLORS.SUCCESS : EMBED_COLORS.ERROR)
    .setAuthor({ name: `Status Premium - ${user.username}`, iconURL: user.displayAvatarURL() });

  if (premium) {
    const daysLeft = Math.ceil((premium.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
    embed.setDescription(`✅ **Premium Ativo**\n📅 Expira em: ${daysLeft} dias\n🗓️ Ativado em: ${premium.redeemedAt.toLocaleDateString('pt-BR')}`);
  } else {
    embed.setDescription(`❌ **Premium Inativo**\n💎 Use \`/premium redeem\` para ativar`);
  }

  return { embeds: [embed] };
}