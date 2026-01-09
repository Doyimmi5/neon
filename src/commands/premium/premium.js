const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "premium",
  description: "sistema premium do bot",
  category: "PREMIUM",
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "info",
        description: "informações sobre premium",
      },
      {
        trigger: "status [@usuário]",
        description: "verificar status premium",
      },
      {
        trigger: "redeem <código>",
        description: "resgatar código premium",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "info",
        description: "informações sobre premium",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "status",
        description: "verificar status premium",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "usuário para verificar",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "redeem",
        description: "resgatar código premium",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "code",
            description: "código premium",
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
      case "info":
        const infoCmd = require("./info");
        return infoCmd.messageRun(message, args.slice(1));
        
      case "status":
        const statusCmd = require("./status");
        return statusCmd.messageRun(message, args.slice(1));
        
      case "redeem":
        const redeemCmd = require("./redeem");
        return redeemCmd.messageRun(message, args.slice(1));
        
      default:
        return message.safeReply("Subcomando inválido. Use: `info`, `status`, `redeem`");
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "info":
        const infoCmd = require("./info");
        return infoCmd.interactionRun(interaction);
        
      case "status":
        const statusCmd = require("./status");
        return statusCmd.interactionRun(interaction);
        
      case "redeem":
        const redeemCmd = require("./redeem");
        return redeemCmd.interactionRun(interaction);
        
      default:
        return interaction.followUp("Subcomando inválido.");
    }
  },
};