const { ApplicationCommandOptionType } = require("discord.js");
const { addStaff, removeStaff, listStaff } = require("@handlers/staff");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "staff",
  description: "gerenciar equipe do bot",
  category: "OWNER",
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "add <@usuário>",
        description: "adicionar usuário à equipe",
      },
      {
        trigger: "remove <@usuário>",
        description: "remover usuário da equipe",
      },
      {
        trigger: "list",
        description: "listar equipe",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "add",
        description: "adicionar usuário à equipe",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário para adicionar",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "remover usuário da equipe",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário para remover",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: "list",
        description: "listar equipe",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async messageRun(message, args) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários podem gerenciar a equipe.");
    }

    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "add":
        return handleAdd(message, args.slice(1));
      case "remove":
        return handleRemove(message, args.slice(1));
      case "list":
        return handleList(message);
      default:
        return message.safeReply("Subcomando inválido. Use: `add`, `remove`, `list`");
    }
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários podem gerenciar a equipe.");
    }

    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "add":
        return handleAddSlash(interaction);
      case "remove":
        return handleRemoveSlash(interaction);
      case "list":
        return handleListSlash(interaction);
    }
  },
};

async function handleAdd(message, args) {
  const user = message.mentions.users.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  if (OWNER_IDS.includes(user.id)) return message.safeReply("Este usuário já é proprietário.");
  
  const success = await addStaff(user.id, message.author.id);
  
  if (success) {
    return message.safeReply(`✅ ${user.tag} foi adicionado à equipe!`);
  } else {
    return message.safeReply("❌ Erro ao adicionar usuário (pode já ser staff).");
  }
}

async function handleRemove(message, args) {
  const user = message.mentions.users.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  
  const success = await removeStaff(user.id);
  
  if (success) {
    return message.safeReply(`✅ ${user.tag} foi removido da equipe!`);
  } else {
    return message.safeReply("❌ Erro ao remover usuário.");
  }
}

async function handleList(message) {
  const staffList = await listStaff();
  
  if (staffList.length === 0) {
    return message.safeReply("Nenhum membro da equipe encontrado.");
  }
  
  let list = "**👥 Equipe do Bot:**\n\n";
  
  for (const staff of staffList) {
    try {
      const user = await message.client.users.fetch(staff.userId);
      const addedBy = await message.client.users.fetch(staff.addedBy);
      list += `• **${user.tag}** - Adicionado por ${addedBy.tag} em ${staff.addedAt.toLocaleDateString('pt-BR')}\n`;
    } catch (error) {
      list += `• **ID: ${staff.userId}** - Adicionado em ${staff.addedAt.toLocaleDateString('pt-BR')}\n`;
    }
  }
  
  return message.safeReply(list);
}

async function handleAddSlash(interaction) {
  const user = interaction.options.getUser("user");
  
  if (OWNER_IDS.includes(user.id)) return interaction.followUp("Este usuário já é proprietário.");
  
  const success = await addStaff(user.id, interaction.user.id);
  
  if (success) {
    return interaction.followUp(`✅ ${user.tag} foi adicionado à equipe!`);
  } else {
    return interaction.followUp("❌ Erro ao adicionar usuário (pode já ser staff).");
  }
}

async function handleRemoveSlash(interaction) {
  const user = interaction.options.getUser("user");
  
  const success = await removeStaff(user.id);
  
  if (success) {
    return interaction.followUp(`✅ ${user.tag} foi removido da equipe!`);
  } else {
    return interaction.followUp("❌ Erro ao remover usuário.");
  }
}

async function handleListSlash(interaction) {
  const staffList = await listStaff();
  
  if (staffList.length === 0) {
    return interaction.followUp("Nenhum membro da equipe encontrado.");
  }
  
  let list = "**👥 Equipe do Bot:**\n\n";
  
  for (const staff of staffList) {
    try {
      const user = await interaction.client.users.fetch(staff.userId);
      const addedBy = await interaction.client.users.fetch(staff.addedBy);
      list += `• **${user.tag}** - Adicionado por ${addedBy.tag} em ${staff.addedAt.toLocaleDateString('pt-BR')}\n`;
    } catch (error) {
      list += `• **ID: ${staff.userId}** - Adicionado em ${staff.addedAt.toLocaleDateString('pt-BR')}\n`;
    }
  }
  
  return interaction.followUp(list);
}