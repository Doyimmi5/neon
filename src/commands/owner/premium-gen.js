const { ApplicationCommandOptionType } = require("discord.js");
const { generatePremiumCode } = require("@handlers/premium");
const { OWNER_IDS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "premium-gen",
  description: "sistema de geração de códigos premium",
  category: "OWNER",
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "single [dias]",
        description: "gerar um código premium",
      },
      {
        trigger: "bulk <quantidade> [dias]",
        description: "gerar múltiplos códigos premium",
      },
      {
        trigger: "custom <código> [dias]",
        description: "gerar código premium personalizado",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "single",
        description: "gerar um código premium",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "days",
            description: "dias de premium",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "bulk",
        description: "gerar múltiplos códigos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "quantidade de códigos",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
          {
            name: "days",
            description: "dias de premium",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "custom",
        description: "gerar código personalizado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "code",
            description: "código personalizado",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "days",
            description: "dias de premium",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    if (!OWNER_IDS.includes(message.author.id)) {
      return message.safeReply("Apenas proprietários podem gerar códigos premium.");
    }

    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case "single":
        return handleSingle(message, args.slice(1));
      case "bulk":
        return handleBulk(message, args.slice(1));
      case "custom":
        return handleCustom(message, args.slice(1));
      default:
        return message.safeReply("Subcomando inválido. Use: `single`, `bulk`, `custom`");
    }
  },

  async interactionRun(interaction) {
    if (!OWNER_IDS.includes(interaction.user.id)) {
      return interaction.followUp("Apenas proprietários podem gerar códigos premium.");
    }

    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case "single":
        return handleSingleSlash(interaction);
      case "bulk":
        return handleBulkSlash(interaction);
      case "custom":
        return handleCustomSlash(interaction);
    }
  },
};

async function handleSingle(message, args) {
  const days = parseInt(args[0]) || 30;
  if (days < 1 || days > 365) return message.safeReply("Dias deve ser entre 1 e 365.");
  
  try {
    const code = await generatePremiumCode(days);
    return message.safeReply(`✅ Código gerado: \`${code}\`\n⏰ Válido por: ${days} dias`);
  } catch (error) {
    return message.safeReply("❌ Erro ao gerar código.");
  }
}

async function handleBulk(message, args) {
  const amount = parseInt(args[0]);
  const days = parseInt(args[1]) || 30;
  
  if (!amount || amount < 1 || amount > 50) return message.safeReply("Quantidade deve ser entre 1 e 50.");
  if (days < 1 || days > 365) return message.safeReply("Dias deve ser entre 1 e 365.");
  
  try {
    const codes = [];
    for (let i = 0; i < amount; i++) {
      const code = await generatePremiumCode(days);
      codes.push(code);
    }
    
    const codeList = codes.map(code => `\`${code}\``).join('\n');
    return message.safeReply(`✅ ${amount} códigos gerados (${days} dias cada):\n${codeList}`);
  } catch (error) {
    return message.safeReply("❌ Erro ao gerar códigos.");
  }
}

async function handleCustom(message, args) {
  const customCode = args[0];
  const days = parseInt(args[1]) || 30;
  
  if (!customCode || customCode.length < 5) return message.safeReply("Código deve ter pelo menos 5 caracteres.");
  if (days < 1 || days > 365) return message.safeReply("Dias deve ser entre 1 e 365.");
  
  try {
    await generatePremiumCode(days, customCode);
    return message.safeReply(`✅ Código personalizado criado: \`${customCode}\`\n⏰ Válido por: ${days} dias`);
  } catch (error) {
    return message.safeReply("❌ Erro ao criar código personalizado (pode já existir).");
  }
}

async function handleSingleSlash(interaction) {
  const days = interaction.options.getInteger("days") || 30;
  if (days < 1 || days > 365) return interaction.followUp("Dias deve ser entre 1 e 365.");
  
  try {
    const code = await generatePremiumCode(days);
    return interaction.followUp(`✅ Código gerado: \`${code}\`\n⏰ Válido por: ${days} dias`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao gerar código.");
  }
}

async function handleBulkSlash(interaction) {
  const amount = interaction.options.getInteger("amount");
  const days = interaction.options.getInteger("days") || 30;
  
  if (amount < 1 || amount > 50) return interaction.followUp("Quantidade deve ser entre 1 e 50.");
  if (days < 1 || days > 365) return interaction.followUp("Dias deve ser entre 1 e 365.");
  
  try {
    const codes = [];
    for (let i = 0; i < amount; i++) {
      const code = await generatePremiumCode(days);
      codes.push(code);
    }
    
    const codeList = codes.map(code => `\`${code}\``).join('\n');
    return interaction.followUp(`✅ ${amount} códigos gerados (${days} dias cada):\n${codeList}`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao gerar códigos.");
  }
}

async function handleCustomSlash(interaction) {
  const customCode = interaction.options.getString("code");
  const days = interaction.options.getInteger("days") || 30;
  
  if (customCode.length < 5) return interaction.followUp("Código deve ter pelo menos 5 caracteres.");
  if (days < 1 || days > 365) return interaction.followUp("Dias deve ser entre 1 e 365.");
  
  try {
    await generatePremiumCode(days, customCode);
    return interaction.followUp(`✅ Código personalizado criado: \`${customCode}\`\n⏰ Válido por: ${days} dias`);
  } catch (error) {
    return interaction.followUp("❌ Erro ao criar código personalizado (pode já existir).");
  }
}