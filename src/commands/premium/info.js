const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "info",
  description: "informações sobre premium",
  category: "PREMIUM",
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    const response = getPremiumInfo();
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = getPremiumInfo();
    return interaction.followUp(response);
  },
};

function getPremiumInfo() {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("💎 Premium - Informações")
    .setDescription("Desbloqueie recursos exclusivos com o Premium!")
    .addFields(
      {
        name: "🎯 Benefícios Premium",
        value: "• Acesso a comandos exclusivos\n• Prioridade no suporte\n• Recursos avançados\n• Sem limitações de uso",
        inline: false
      },
      {
        name: "📝 Como ativar",
        value: "Use `/premium redeem <código>` com um código válido",
        inline: false
      },
      {
        name: "❓ Suporte",
        value: "Entre em contato com os administradores para obter códigos premium",
        inline: false
      }
    )
    .setFooter({ text: "Premium - Eleve sua experiência!" })
    .setTimestamp();

  return { embeds: [embed] };
}