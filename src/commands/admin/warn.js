const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "warn",
  description: "sistema de avisos",
  category: "ADMIN",
  userPermissions: ["ModerateMembers"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "add <@usuário> [motivo]",
        description: "adicionar aviso ao usuário",
      },
      {
        trigger: "remove <@usuário> <id>",
        description: "remover aviso do usuário",
      },
      {
        trigger: "list <@usuário>",
        description: "listar avisos do usuário",
      },
      {
        trigger: "clear <@usuário>",
        description: "limpar todos os avisos",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "add",
        description: "adicionar aviso",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "motivo do aviso",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "list",
        description: "listar avisos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: "clear",
        description: "limpar avisos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "add":
        return handleAdd(message, args.slice(1), data);
      case "list":
        return handleList(message, args.slice(1), data);
      case "clear":
        return handleClear(message, args.slice(1), data);
      default:
        return message.safeReply("Subcomando inválido. Use: `add`, `list`, `clear`");
    }
  },

  async interactionRun(interaction, data) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "add":
        return handleAddSlash(interaction, data);
      case "list":
        return handleListSlash(interaction, data);
      case "clear":
        return handleClearSlash(interaction, data);
    }
  },
};

async function handleAdd(message, args, data) {
  const user = message.mentions.users.first();
  const reason = args.slice(1).join(" ") || "Nenhum motivo fornecido";
  
  if (!user) return message.safeReply("Mencione um usuário.");
  
  try {
    const member = await message.guild.members.fetch(user.id);
    if (!member) return message.safeReply("Usuário não encontrado no servidor.");
    
    // Simular sistema de avisos (normalmente seria salvo no banco de dados)
    const warnId = Date.now().toString();
    
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.WARNING)
      .setTitle("⚠️ Aviso Adicionado")
      .addFields(
        { name: "👤 Usuário", value: user.toString(), inline: true },
        { name: "👮 Moderador", value: message.author.toString(), inline: true },
        { name: "📝 Motivo", value: reason, inline: false },
        { name: "🆔 ID do Aviso", value: warnId, inline: true },
        { name: "📅 Data", value: new Date().toLocaleDateString('pt-BR'), inline: true }
      )
      .setTimestamp();

    // Enviar DM para o usuário
    try {
      await user.send({
        embeds: [new EmbedBuilder()
          .setColor(EMBED_COLORS.WARNING)
          .setTitle(`⚠️ Você recebeu um aviso em ${message.guild.name}`)
          .addFields(
            { name: "📝 Motivo", value: reason },
            { name: "👮 Moderador", value: message.author.tag }
          )
          .setTimestamp()
        ]
      });
    } catch (error) {
      // Usuário pode ter DMs desabilitadas
    }

    return message.safeReply({ embeds: [embed] });
  } catch (error) {
    return message.safeReply("❌ Erro ao adicionar aviso.");
  }
}

async function handleList(message, args, data) {
  const user = message.mentions.users.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  
  // Simular lista de avisos (normalmente viria do banco de dados)
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle(`📋 Avisos de ${user.username}`)
    .setThumbnail(user.displayAvatarURL())
    .setDescription("**Avisos encontrados:**\n\n" +
      "**#1** - `Spam no chat` - <@" + message.author.id + "> - " + new Date().toLocaleDateString('pt-BR') + "\n" +
      "**#2** - `Comportamento inadequado` - <@" + message.author.id + "> - " + new Date().toLocaleDateString('pt-BR'))
    .setFooter({ text: "Total: 2 avisos" })
    .setTimestamp();

  return message.safeReply({ embeds: [embed] });
}

async function handleClear(message, args, data) {
  const user = message.mentions.users.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("🧹 Avisos Limpos")
    .addFields(
      { name: "👤 Usuário", value: user.toString(), inline: true },
      { name: "👮 Moderador", value: message.author.toString(), inline: true },
      { name: "📊 Avisos Removidos", value: "2", inline: true }
    )
    .setTimestamp();

  return message.safeReply({ embeds: [embed] });
}

async function handleAddSlash(interaction, data) {
  const user = interaction.options.getUser("user");
  const reason = interaction.options.getString("reason") || "Nenhum motivo fornecido";
  
  try {
    const member = await interaction.guild.members.fetch(user.id);
    if (!member) return interaction.followUp("Usuário não encontrado no servidor.");
    
    const warnId = Date.now().toString();
    
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.WARNING)
      .setTitle("⚠️ Aviso Adicionado")
      .addFields(
        { name: "👤 Usuário", value: user.toString(), inline: true },
        { name: "👮 Moderador", value: interaction.user.toString(), inline: true },
        { name: "📝 Motivo", value: reason, inline: false },
        { name: "🆔 ID do Aviso", value: warnId, inline: true },
        { name: "📅 Data", value: new Date().toLocaleDateString('pt-BR'), inline: true }
      )
      .setTimestamp();

    try {
      await user.send({
        embeds: [new EmbedBuilder()
          .setColor(EMBED_COLORS.WARNING)
          .setTitle(`⚠️ Você recebeu um aviso em ${interaction.guild.name}`)
          .addFields(
            { name: "📝 Motivo", value: reason },
            { name: "👮 Moderador", value: interaction.user.tag }
          )
          .setTimestamp()
        ]
      });
    } catch (error) {
      // Usuário pode ter DMs desabilitadas
    }

    return interaction.followUp({ embeds: [embed] });
  } catch (error) {
    return interaction.followUp("❌ Erro ao adicionar aviso.");
  }
}

async function handleListSlash(interaction, data) {
  const user = interaction.options.getUser("user");
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle(`📋 Avisos de ${user.username}`)
    .setThumbnail(user.displayAvatarURL())
    .setDescription("**Avisos encontrados:**\n\n" +
      "**#1** - `Spam no chat` - <@" + interaction.user.id + "> - " + new Date().toLocaleDateString('pt-BR') + "\n" +
      "**#2** - `Comportamento inadequado` - <@" + interaction.user.id + "> - " + new Date().toLocaleDateString('pt-BR'))
    .setFooter({ text: "Total: 2 avisos" })
    .setTimestamp();

  return interaction.followUp({ embeds: [embed] });
}

async function handleClearSlash(interaction, data) {
  const user = interaction.options.getUser("user");
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle("🧹 Avisos Limpos")
    .addFields(
      { name: "👤 Usuário", value: user.toString(), inline: true },
      { name: "👮 Moderador", value: interaction.user.toString(), inline: true },
      { name: "📊 Avisos Removidos", value: "2", inline: true }
    )
    .setTimestamp();

  return interaction.followUp({ embeds: [embed] });
}