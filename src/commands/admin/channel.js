const { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "channel",
  description: "gerenciar canais do servidor",
  category: "ADMIN",
  userPermissions: ["ManageChannels"],
  botPermissions: ["ManageChannels"],
  command: {
    enabled: true,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "create <nome> [tipo]",
        description: "criar novo canal",
      },
      {
        trigger: "delete <#canal>",
        description: "deletar canal",
      },
      {
        trigger: "clone <#canal>",
        description: "clonar canal",
      },
      {
        trigger: "lock <#canal>",
        description: "trancar canal",
      },
      {
        trigger: "unlock <#canal>",
        description: "destrancar canal",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "create",
        description: "criar novo canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do canal",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "type",
            description: "tipo do canal",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
              { name: "Texto", value: "text" },
              { name: "Voz", value: "voice" },
              { name: "Categoria", value: "category" },
            ],
          },
        ],
      },
      {
        name: "delete",
        description: "deletar canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para deletar",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
      {
        name: "clone",
        description: "clonar canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para clonar",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
      {
        name: "lock",
        description: "trancar canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para trancar",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
      {
        name: "unlock",
        description: "destrancar canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para destrancar",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "create":
        return handleCreate(message, args.slice(1));
      case "delete":
        return handleDelete(message, args.slice(1));
      case "clone":
        return handleClone(message, args.slice(1));
      case "lock":
        return handleLock(message, args.slice(1));
      case "unlock":
        return handleUnlock(message, args.slice(1));
      default:
        return message.safeReply("Subcomando inválido. Use: `create`, `delete`, `clone`, `lock`, `unlock`");
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "create":
        return handleCreateSlash(interaction);
      case "delete":
        return handleDeleteSlash(interaction);
      case "clone":
        return handleCloneSlash(interaction);
      case "lock":
        return handleLockSlash(interaction);
      case "unlock":
        return handleUnlockSlash(interaction);
    }
  },
};

async function handleCreate(message, args) {
  const name = args[0];
  const type = args[1] || "text";
  
  if (!name) return message.safeReply("Forneça um nome para o canal.");
  
  try {
    let channelType;
    switch (type.toLowerCase()) {
      case "voice":
      case "voz":
        channelType = ChannelType.GuildVoice;
        break;
      case "category":
      case "categoria":
        channelType = ChannelType.GuildCategory;
        break;
      default:
        channelType = ChannelType.GuildText;
    }
    
    const channel = await message.guild.channels.create({
      name: name,
      type: channelType,
    });
    
    return message.safeReply(`✅ Canal ${channel} criado com sucesso!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao criar canal.");
  }
}

async function handleDelete(message, args) {
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
  
  if (!channel) return message.safeReply("Canal não encontrado.");
  
  try {
    const channelName = channel.name;
    await channel.delete();
    return message.safeReply(`✅ Canal **${channelName}** deletado com sucesso!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao deletar canal.");
  }
}

async function handleClone(message, args) {
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
  
  if (!channel) return message.safeReply("Canal não encontrado.");
  
  try {
    const cloned = await channel.clone();
    return message.safeReply(`✅ Canal ${cloned} clonado com sucesso!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao clonar canal.");
  }
}

async function handleLock(message, args) {
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
  
  try {
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });
    return message.safeReply(`🔒 Canal ${channel} trancado!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao trancar canal.");
  }
}

async function handleUnlock(message, args) {
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
  
  try {
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: null,
    });
    return message.safeReply(`🔓 Canal ${channel} destrancado!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao destrancar canal.");
  }
}

async function handleCreateSlash(interaction) {
  const name = interaction.options.getString("name");
  const type = interaction.options.getString("type") || "text";
  
  try {
    let channelType;
    switch (type) {
      case "voice":
        channelType = ChannelType.GuildVoice;
        break;
      case "category":
        channelType = ChannelType.GuildCategory;
        break;
      default:
        channelType = ChannelType.GuildText;
    }
    
    const channel = await interaction.guild.channels.create({
      name: name,
      type: channelType,
    });
    
    return interaction.followUp(`✅ Canal ${channel} criado com sucesso!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao criar canal.");
  }
}

async function handleDeleteSlash(interaction) {
  const channel = interaction.options.getChannel("channel");
  
  try {
    const channelName = channel.name;
    await channel.delete();
    return interaction.followUp(`✅ Canal **${channelName}** deletado com sucesso!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao deletar canal.");
  }
}

async function handleCloneSlash(interaction) {
  const channel = interaction.options.getChannel("channel");
  
  try {
    const cloned = await channel.clone();
    return interaction.followUp(`✅ Canal ${cloned} clonado com sucesso!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao clonar canal.");
  }
}

async function handleLockSlash(interaction) {
  const channel = interaction.options.getChannel("channel");
  
  try {
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });
    return interaction.followUp(`🔒 Canal ${channel} trancado!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao trancar canal.");
  }
}

async function handleUnlockSlash(interaction) {
  const channel = interaction.options.getChannel("channel");
  
  try {
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null,
    });
    return interaction.followUp(`🔓 Canal ${channel} destrancado!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao destrancar canal.");
  }
}