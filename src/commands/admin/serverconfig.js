const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "serverconfig",
  description: "configurar servidor",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  botPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "name <nome>",
        description: "alterar nome do servidor",
      },
      {
        trigger: "icon <url>",
        description: "alterar ícone do servidor",
      },
      {
        trigger: "banner <url>",
        description: "alterar banner do servidor",
      },
      {
        trigger: "verification <level>",
        description: "alterar nível de verificação",
      },
      {
        trigger: "info",
        description: "informações do servidor",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "name",
        description: "alterar nome do servidor",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "novo nome",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "icon",
        description: "alterar ícone do servidor",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "url",
            description: "URL da imagem",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "verification",
        description: "alterar nível de verificação",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "level",
            description: "nível de verificação",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            choices: [
              { name: "Nenhum", value: 0 },
              { name: "Baixo", value: 1 },
              { name: "Médio", value: 2 },
              { name: "Alto", value: 3 },
              { name: "Muito Alto", value: 4 },
            ],
          },
        ],
      },
      {
        name: "info",
        description: "informações do servidor",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async messageRun(message, args) {
    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "name":
        return handleName(message, args.slice(1));
      case "icon":
        return handleIcon(message, args.slice(1));
      case "verification":
        return handleVerification(message, args.slice(1));
      case "info":
        return handleInfo(message);
      default:
        return message.safeReply("Subcomando inválido. Use: `name`, `icon`, `verification`, `info`");
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "name":
        return handleNameSlash(interaction);
      case "icon":
        return handleIconSlash(interaction);
      case "verification":
        return handleVerificationSlash(interaction);
      case "info":
        return handleInfoSlash(interaction);
    }
  },
};

async function handleName(message, args) {
  const name = args.join(" ");
  
  if (!name) return message.safeReply("Forneça um nome para o servidor.");
  
  try {
    const oldName = message.guild.name;
    await message.guild.setName(name);
    return message.safeReply(`✅ Nome do servidor alterado de **${oldName}** para **${name}**!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao alterar nome do servidor.");
  }
}

async function handleIcon(message, args) {
  const url = args[0];
  
  if (!url) return message.safeReply("Forneça uma URL para o ícone.");
  
  try {
    await message.guild.setIcon(url);
    return message.safeReply("✅ Ícone do servidor alterado com sucesso!");
  } catch (error) {
    return message.safeReply("❌ Erro ao alterar ícone do servidor.");
  }
}

async function handleVerification(message, args) {
  const level = parseInt(args[0]);
  
  if (isNaN(level) || level < 0 || level > 4) {
    return message.safeReply("Nível deve ser entre 0 e 4.");
  }
  
  try {
    await message.guild.setVerificationLevel(level);
    const levels = ["Nenhum", "Baixo", "Médio", "Alto", "Muito Alto"];
    return message.safeReply(`✅ Nível de verificação alterado para **${levels[level]}**!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao alterar nível de verificação.");
  }
}

async function handleInfo(message) {
  const guild = message.guild;
  const owner = await guild.fetchOwner();
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle(`📋 Informações - ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "👑 Proprietário", value: owner.user.tag, inline: true },
      { name: "📅 Criado em", value: guild.createdAt.toLocaleDateString('pt-BR'), inline: true },
      { name: "👥 Membros", value: guild.memberCount.toString(), inline: true },
      { name: "📺 Canais", value: guild.channels.cache.size.toString(), inline: true },
      { name: "🎭 Cargos", value: guild.roles.cache.size.toString(), inline: true },
      { name: "🔒 Verificação", value: guild.verificationLevel.toString(), inline: true },
      { name: "🚀 Boosts", value: guild.premiumSubscriptionCount?.toString() || "0", inline: true },
      { name: "⭐ Nível", value: guild.premiumTier.toString(), inline: true },
      { name: "🆔 ID", value: guild.id, inline: true }
    )
    .setFooter({ text: "Configurações do Servidor" })
    .setTimestamp();

  return message.safeReply({ embeds: [embed] });
}

async function handleNameSlash(interaction) {
  const name = interaction.options.getString("name");
  
  try {
    const oldName = interaction.guild.name;
    await interaction.guild.setName(name);
    return interaction.followUp(`✅ Nome do servidor alterado de **${oldName}** para **${name}**!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao alterar nome do servidor.");
  }
}

async function handleIconSlash(interaction) {
  const url = interaction.options.getString("url");
  
  try {
    await interaction.guild.setIcon(url);
    return interaction.followUp("✅ Ícone do servidor alterado com sucesso!");
  } catch (error) {
    return interaction.followUp("❌ Erro ao alterar ícone do servidor.");
  }
}

async function handleVerificationSlash(interaction) {
  const level = interaction.options.getInteger("level");
  
  try {
    await interaction.guild.setVerificationLevel(level);
    const levels = ["Nenhum", "Baixo", "Médio", "Alto", "Muito Alto"];
    return interaction.followUp(`✅ Nível de verificação alterado para **${levels[level]}**!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao alterar nível de verificação.");
  }
}

async function handleInfoSlash(interaction) {
  const guild = interaction.guild;
  const owner = await guild.fetchOwner();
  
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle(`📋 Informações - ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "👑 Proprietário", value: owner.user.tag, inline: true },
      { name: "📅 Criado em", value: guild.createdAt.toLocaleDateString('pt-BR'), inline: true },
      { name: "👥 Membros", value: guild.memberCount.toString(), inline: true },
      { name: "📺 Canais", value: guild.channels.cache.size.toString(), inline: true },
      { name: "🎭 Cargos", value: guild.roles.cache.size.toString(), inline: true },
      { name: "🔒 Verificação", value: guild.verificationLevel.toString(), inline: true },
      { name: "🚀 Boosts", value: guild.premiumSubscriptionCount?.toString() || "0", inline: true },
      { name: "⭐ Nível", value: guild.premiumTier.toString(), inline: true },
      { name: "🆔 ID", value: guild.id, inline: true }
    )
    .setFooter({ text: "Configurações do Servidor" })
    .setTimestamp();

  return interaction.followUp({ embeds: [embed] });
}