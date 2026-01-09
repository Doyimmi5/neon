const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const EMBEDS_DIR = path.join(process.cwd(), "embeds");

/**
 * Carrega todos os arquivos de embed
 * @returns {Object}
 */
function loadEmbeds() {
  const embeds = {};
  
  if (!fs.existsSync(EMBEDS_DIR)) {
    fs.mkdirSync(EMBEDS_DIR, { recursive: true });
    return embeds;
  }
  
  const files = fs.readdirSync(EMBEDS_DIR).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    try {
      const filePath = path.join(EMBEDS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileEmbeds = JSON.parse(fileContent);
      
      Object.assign(embeds, fileEmbeds);
    } catch (error) {
      console.error(`Erro ao carregar embed ${file}:`, error);
    }
  }
  
  return embeds;
}

/**
 * Lista todos os embeds disponíveis
 * @returns {string[]}
 */
function listEmbeds() {
  const embeds = loadEmbeds();
  return Object.keys(embeds);
}

/**
 * Processa variáveis no texto
 * @param {string} text 
 * @param {Object} variables 
 * @returns {string}
 */
function processVariables(text, variables = {}) {
  if (!text) return text;
  
  let processed = text;
  
  // Substituir variáveis
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processed = processed.replace(regex, value);
  }
  
  return processed;
}

/**
 * Cria embed a partir de configuração
 * @param {string} embedName 
 * @param {Object} variables 
 * @returns {EmbedBuilder|null}
 */
function createEmbed(embedName, variables = {}) {
  const embeds = loadEmbeds();
  const embedConfig = embeds[embedName];
  
  if (!embedConfig) return null;
  
  const embed = new EmbedBuilder();
  
  // Título
  if (embedConfig.title) {
    embed.setTitle(processVariables(embedConfig.title, variables));
  }
  
  // Descrição
  if (embedConfig.description) {
    embed.setDescription(processVariables(embedConfig.description, variables));
  }
  
  // Cor
  if (embedConfig.color) {
    embed.setColor(embedConfig.color);
  }
  
  // Thumbnail
  if (embedConfig.thumbnail) {
    embed.setThumbnail(processVariables(embedConfig.thumbnail, variables));
  }
  
  // Imagem
  if (embedConfig.image) {
    embed.setImage(processVariables(embedConfig.image, variables));
  }
  
  // Footer
  if (embedConfig.footer) {
    const footerText = processVariables(embedConfig.footer.text || "", variables);
    const footerIcon = embedConfig.footer.icon ? processVariables(embedConfig.footer.icon, variables) : null;
    embed.setFooter({ text: footerText, iconURL: footerIcon });
  }
  
  // Campos
  if (embedConfig.fields && Array.isArray(embedConfig.fields)) {
    for (const field of embedConfig.fields) {
      embed.addFields({
        name: processVariables(field.name, variables),
        value: processVariables(field.value, variables),
        inline: field.inline || false
      });
    }
  }
  
  // Timestamp
  if (embedConfig.timestamp) {
    embed.setTimestamp();
  }
  
  return embed;
}

module.exports = {
  loadEmbeds,
  listEmbeds,
  createEmbed,
  processVariables
};