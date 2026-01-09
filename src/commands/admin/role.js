const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "role",
  description: "gerenciar cargos do servidor",
  category: "ADMIN",
  userPermissions: ["ManageRoles"],
  botPermissions: ["ManageRoles"],
  command: {
    enabled: true,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "create <nome> [cor]",
        description: "criar novo cargo",
      },
      {
        trigger: "delete <@cargo>",
        description: "deletar cargo",
      },
      {
        trigger: "add <@usuário> <@cargo>",
        description: "adicionar cargo ao usuário",
      },
      {
        trigger: "remove <@usuário> <@cargo>",
        description: "remover cargo do usuário",
      },
      {
        trigger: "color <@cargo> <cor>",
        description: "alterar cor do cargo",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "create",
        description: "criar novo cargo",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do cargo",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "color",
            description: "cor do cargo (hex)",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "delete",
        description: "deletar cargo",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "cargo para deletar",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
      {
        name: "add",
        description: "adicionar cargo ao usuário",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "role",
            description: "cargo",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "remover cargo do usuário",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "role",
            description: "cargo",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
      {
        name: "color",
        description: "alterar cor do cargo",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "cargo",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
          {
            name: "color",
            description: "nova cor (hex)",
            type: ApplicationCommandOptionType.String,
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
      case "add":
        return handleAdd(message, args.slice(1));
      case "remove":
        return handleRemove(message, args.slice(1));
      case "color":
        return handleColor(message, args.slice(1));
      default:
        return message.safeReply("Subcomando inválido. Use: `create`, `delete`, `add`, `remove`, `color`");
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "create":
        return handleCreateSlash(interaction);
      case "delete":
        return handleDeleteSlash(interaction);
      case "add":
        return handleAddSlash(interaction);
      case "remove":
        return handleRemoveSlash(interaction);
      case "color":
        return handleColorSlash(interaction);
    }
  },
};

async function handleCreate(message, args) {
  const name = args[0];
  const color = args[1];
  
  if (!name) return message.safeReply("Forneça um nome para o cargo.");
  
  try {
    const role = await message.guild.roles.create({
      name: name,
      color: color || null,
    });
    
    return message.safeReply(`✅ Cargo ${role} criado com sucesso!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao criar cargo.");
  }
}

async function handleDelete(message, args) {
  const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
  
  if (!role) return message.safeReply("Cargo não encontrado.");
  if (role.managed) return message.safeReply("Não posso deletar cargos gerenciados por bots.");
  
  try {
    const roleName = role.name;
    await role.delete();
    return message.safeReply(`✅ Cargo **${roleName}** deletado com sucesso!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao deletar cargo.");
  }
}

async function handleAdd(message, args) {
  const user = message.mentions.users.first();
  const role = message.mentions.roles.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  if (!role) return message.safeReply("Mencione um cargo.");
  
  try {
    const member = await message.guild.members.fetch(user.id);
    await member.roles.add(role);
    return message.safeReply(`✅ Cargo ${role} adicionado a ${user}!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao adicionar cargo.");
  }
}

async function handleRemove(message, args) {
  const user = message.mentions.users.first();
  const role = message.mentions.roles.first();
  
  if (!user) return message.safeReply("Mencione um usuário.");
  if (!role) return message.safeReply("Mencione um cargo.");
  
  try {
    const member = await message.guild.members.fetch(user.id);
    await member.roles.remove(role);
    return message.safeReply(`✅ Cargo ${role} removido de ${user}!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao remover cargo.");
  }
}

async function handleColor(message, args) {
  const role = message.mentions.roles.first();
  const color = args[1];
  
  if (!role) return message.safeReply("Mencione um cargo.");
  if (!color) return message.safeReply("Forneça uma cor (hex).");
  
  try {
    await role.setColor(color);
    return message.safeReply(`✅ Cor do cargo ${role} alterada!`);
  } catch (error) {
    return message.safeReply("❌ Erro ao alterar cor do cargo.");
  }
}

async function handleCreateSlash(interaction) {
  const name = interaction.options.getString("name");
  const color = interaction.options.getString("color");
  
  try {
    const role = await interaction.guild.roles.create({
      name: name,
      color: color || null,
    });
    
    return interaction.followUp(`✅ Cargo ${role} criado com sucesso!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao criar cargo.");
  }
}

async function handleDeleteSlash(interaction) {
  const role = interaction.options.getRole("role");
  
  if (role.managed) return interaction.followUp("Não posso deletar cargos gerenciados por bots.");
  
  try {
    const roleName = role.name;
    await role.delete();
    return interaction.followUp(`✅ Cargo **${roleName}** deletado com sucesso!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao deletar cargo.");
  }
}

async function handleAddSlash(interaction) {
  const user = interaction.options.getUser("user");
  const role = interaction.options.getRole("role");
  
  try {
    const member = await interaction.guild.members.fetch(user.id);
    await member.roles.add(role);
    return interaction.followUp(`✅ Cargo ${role} adicionado a ${user}!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao adicionar cargo.");
  }
}

async function handleRemoveSlash(interaction) {
  const user = interaction.options.getUser("user");
  const role = interaction.options.getRole("role");
  
  try {
    const member = await interaction.guild.members.fetch(user.id);
    await member.roles.remove(role);
    return interaction.followUp(`✅ Cargo ${role} removido de ${user}!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao remover cargo.");
  }
}

async function handleColorSlash(interaction) {
  const role = interaction.options.getRole("role");
  const color = interaction.options.getString("color");
  
  try {
    await role.setColor(color);
    return interaction.followUp(`✅ Cor do cargo ${role} alterada!`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao alterar cor do cargo.");
  }
}