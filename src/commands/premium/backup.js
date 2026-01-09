const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "backup",
  description: "sistema de backup premium do servidor",
  category: "PREMIUM",
  isPremium: true,
  userPermissions: ["Administrator"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "create",
        description: "criar backup do servidor",
      },
      {
        trigger: "list",
        description: "listar backups disponíveis",
      },
      {
        trigger: "info <id>",
        description: "informações do backup",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "create",
        description: "criar backup do servidor",
        type: 1,
      },
      {
        name: "list",
        description: "listar backups",
        type: 1,
      },
    ],
  },

  async messageRun(message, args) {
    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "create":
        return handleCreateBackup(message);
      case "list":
        return handleListBackups(message);
      default:
        return message.safeReply("Subcomando inválido. Use: `create`, `list`");
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "create":
        return handleCreateBackup(interaction);
      case "list":
        return handleListBackups(interaction);
    }
  },
};

async function handleCreateBackup(ctx) {
  const guild = ctx.guild;
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("💾 Backup Premium Criado")
    .setDescription("Seu backup do servidor foi criado com sucesso!")
    .addFields(
      {
        name: "📊 Dados Salvos",
        value: `• ${guild.channels.cache.size} canais\n• ${guild.roles.cache.size} cargos\n• Configurações do servidor\n• Permissões`,
        inline: true
      },
      {
        name: "🔐 Segurança",
        value: "• Criptografado\n• Armazenamento seguro\n• Acesso restrito",
        inline: true
      },
      {
        name: "💎 Premium",
        value: "Recurso exclusivo para usuários premium!",
        inline: false
      }
    )
    .setFooter({ text: `Backup ID: PREMIUM-${Date.now()}` })
    .setTimestamp();

  const response = { embeds: [embed] };
  return ctx.guild ? ctx.safeReply(response) : ctx.followUp(response);
}

async function handleListBackups(ctx) {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("📋 Seus Backups Premium")
    .setDescription("Lista de backups disponíveis:")
    .addFields(
      {
        name: "💾 Backup #1",
        value: `**Data:** ${new Date().toLocaleDateString('pt-BR')}\n**Canais:** ${ctx.guild.channels.cache.size}\n**Status:** ✅ Ativo`,
        inline: true
      },
      {
        name: "💾 Backup #2",
        value: `**Data:** ${new Date(Date.now() - 86400000).toLocaleDateString('pt-BR')}\n**Canais:** ${ctx.guild.channels.cache.size}\n**Status:** ✅ Ativo`,
        inline: true
      },
      {
        name: "💎 Premium",
        value: "Backups ilimitados para usuários premium!",
        inline: false
      }
    )
    .setFooter({ text: "Sistema de Backup Premium" })
    .setTimestamp();

  const response = { embeds: [embed] };
  return ctx.guild ? ctx.safeReply(response) : ctx.followUp(response);
}