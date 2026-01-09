const { ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { createEmbed, listEmbeds } = require("@handlers/embeds");
const { isStaff } = require("@handlers/staff");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "sendembed",
  description: "enviar embed personalizado",
  category: "ADMIN",
  command: {
    enabled: true,
    minArgsCount: 2,
    usage: "<#canal> <embed> [variáveis]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "channel",
        description: "canal para enviar o embed",
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true,
      },
      {
        name: "embed",
        description: "nome do embed",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "variables",
        description: "variáveis (formato: key=value,key2=value2)",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    // Verificar permissões
    const isOwner = OWNER_IDS.includes(message.author.id);
    const isStaffMember = await isStaff(message.author.id);
    
    if (!isOwner && !isStaffMember && !message.member.permissions.has("ManageMessages")) {
      return message.safeReply("Você precisa ser staff ou ter permissão de gerenciar mensagens.");
    }

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    const embedName = args[1];
    const variablesStr = args.slice(2).join(" ");

    if (!channel) return message.safeReply("Canal não encontrado.");
    if (!channel.canSendEmbeds()) return message.safeReply("Não posso enviar embeds neste canal.");

    const response = await sendCustomEmbed(channel, embedName, variablesStr, message);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    // Verificar permissões
    const isOwner = OWNER_IDS.includes(interaction.user.id);
    const isStaffMember = await isStaff(interaction.user.id);
    
    if (!isOwner && !isStaffMember && !interaction.member.permissions.has("ManageMessages")) {
      return interaction.followUp("Você precisa ser staff ou ter permissão de gerenciar mensagens.");
    }

    const channel = interaction.options.getChannel("channel");
    const embedName = interaction.options.getString("embed");
    const variablesStr = interaction.options.getString("variables") || "";

    if (!channel.canSendEmbeds()) return interaction.followUp("Não posso enviar embeds neste canal.");

    const response = await sendCustomEmbed(channel, embedName, variablesStr, interaction);
    return interaction.followUp(response);
  },
};

async function sendCustomEmbed(channel, embedName, variablesStr, ctx) {
  // Listar embeds disponíveis se não especificado
  if (embedName === "list") {
    const availableEmbeds = listEmbeds();
    if (availableEmbeds.length === 0) {
      return "Nenhum embed encontrado. Crie arquivos JSON na pasta `embeds/`.";
    }
    return `**Embeds disponíveis:**\n${availableEmbeds.map(name => `• \`${name}\``).join('\n')}`;
  }

  // Processar variáveis
  const variables = {};
  
  // Variáveis padrão
  const user = ctx.user || ctx.author;
  const guild = ctx.guild;
  
  variables.user = user.toString();
  variables['user.tag'] = user.tag;
  variables['user.username'] = user.username;
  variables['user.avatar'] = user.displayAvatarURL();
  variables.server = guild.name;
  variables['server.name'] = guild.name;
  variables['server.icon'] = guild.iconURL() || "";
  variables.memberCount = guild.memberCount.toString();

  // Variáveis personalizadas
  if (variablesStr) {
    const pairs = variablesStr.split(',');
    for (const pair of pairs) {
      const [key, value] = pair.split('=').map(s => s.trim());
      if (key && value) {
        variables[key] = value;
      }
    }
  }

  // Criar embed
  const embed = createEmbed(embedName, variables);
  
  if (!embed) {
    const availableEmbeds = listEmbeds();
    return `Embed \`${embedName}\` não encontrado.\n**Disponíveis:** ${availableEmbeds.join(', ')}`;
  }

  try {
    await channel.send({ embeds: [embed] });
    return `✅ Embed \`${embedName}\` enviado para ${channel}!`;
  } catch (error) {
    return `❌ Erro ao enviar embed: ${error.message}`;
  }
}