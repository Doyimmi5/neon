const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "serveranalytics",
  description: "análise avançada do servidor",
  category: "PREMIUM",
  isPremium: true,
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    const response = await getServerAnalytics(message.guild);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = await getServerAnalytics(interaction.guild);
    return interaction.followUp(response);
  },
};

async function getServerAnalytics(guild) {
  const members = await guild.members.fetch();
  const channels = guild.channels.cache;
  
  const bots = members.filter(m => m.user.bot).size;
  const humans = members.filter(m => !m.user.bot).size;
  const online = members.filter(m => m.presence?.status === 'online').size;
  const textChannels = channels.filter(c => c.type === 0).size;
  const voiceChannels = channels.filter(c => c.type === 2).size;
  const categories = channels.filter(c => c.type === 4).size;
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("📊 Análise Avançada do Servidor")
    .setThumbnail(guild.iconURL())
    .addFields(
      {
        name: "👥 Membros",
        value: `**Total:** ${guild.memberCount}\n**Humanos:** ${humans}\n**Bots:** ${bots}\n**Online:** ${online}`,
        inline: true
      },
      {
        name: "📺 Canais",
        value: `**Total:** ${channels.size}\n**Texto:** ${textChannels}\n**Voz:** ${voiceChannels}\n**Categorias:** ${categories}`,
        inline: true
      },
      {
        name: "🎭 Cargos",
        value: `**Total:** ${guild.roles.cache.size}\n**Com Cor:** ${guild.roles.cache.filter(r => r.color !== 0).size}`,
        inline: true
      },
      {
        name: "📈 Estatísticas",
        value: `**Criado:** ${guild.createdAt.toLocaleDateString('pt-BR')}\n**Nível:** ${guild.premiumTier}\n**Boosts:** ${guild.premiumSubscriptionCount || 0}`,
        inline: true
      },
      {
        name: "🔒 Segurança",
        value: `**Verificação:** ${guild.verificationLevel}\n**Filtro:** ${guild.explicitContentFilter}`,
        inline: true
      },
      {
        name: "💎 Premium",
        value: "Análise disponível apenas para usuários premium!",
        inline: true
      }
    )
    .setFooter({ text: "Análise Premium • Dados em tempo real" })
    .setTimestamp();

  return { embeds: [embed] };
}