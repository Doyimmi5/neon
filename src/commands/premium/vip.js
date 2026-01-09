const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "vip",
  description: "recursos exclusivos premium",
  category: "PREMIUM",
  isPremium: true,
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    const response = getVipFeatures(message.author);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = getVipFeatures(interaction.user);
    return interaction.followUp(response);
  },
};

function getVipFeatures(user) {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("👑 Recursos Premium Exclusivos")
    .setAuthor({ name: `${user.username} - Usuário Premium`, iconURL: user.displayAvatarURL() })
    .setDescription("Parabéns! Você tem acesso aos recursos premium exclusivos!")
    .addFields(
      {
        name: "🎯 Recursos Desbloqueados",
        value: "• Comandos premium exclusivos\n• Prioridade no processamento\n• Limites aumentados\n• Suporte prioritário",
        inline: false
      },
      {
        name: "🚀 Benefícios Ativos",
        value: "• Sem cooldowns em comandos especiais\n• Acesso a comandos avançados\n• Recursos experimentais\n• Badge premium no perfil",
        inline: false
      },
      {
        name: "💎 Status",
        value: "**Premium Ativo** ✅",
        inline: false
      }
    )
    .setFooter({ text: "Obrigado por ser um usuário premium!" })
    .setTimestamp();

  return { embeds: [embed] };
}