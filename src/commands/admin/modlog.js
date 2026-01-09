const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "modlog",
  description: "ativar ou desativar logs de moderação",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<#canal|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "channel",
        description: "canal para enviar logs de moderação",
        required: false,
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    let targetChannel;

    if (input === "none" || input === "off" || input === "disable") targetChannel = null;
    else {
      if (message.mentions.channels.size === 0) return message.safeReply("Uso incorreto do comando");
      targetChannel = message.mentions.channels.first();
    }

    const response = await setChannel(targetChannel, data.settings);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const channel = interaction.options.getChannel("channel");
    const response = await setChannel(channel, data.settings);
    return interaction.followUp(response);
  },
};

async function setChannel(targetChannel, settings) {
  if (!targetChannel && !settings.modlog_channel) {
    return "Já está desabilitado";
  }

  if (targetChannel && !targetChannel.canSendEmbeds()) {
    return "Ugh! Não posso enviar logs para esse canal? Preciso das permissões `Enviar Mensagens` e `Incorporar Links` nesse canal";
  }

  settings.modlog_channel = targetChannel?.id;
  await settings.save();
  return `Configuração salva! Canal de modlog ${targetChannel ? "atualizado" : "removido"}`;
}
