const Premium = require("@schemas/Premium");

/**
 * Verifica se o usuário tem premium ativo
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
async function isPremiumUser(userId) {
  const premium = await Premium.findOne({
    userId,
    expiresAt: { $gt: new Date() },
    redeemedAt: { $ne: null }
  });
  return !!premium;
}

/**
 * Gera um código premium
 * @param {number} days 
 * @param {string} customCode 
 * @returns {Promise<string>}
 */
async function generatePremiumCode(days = 30, customCode = null) {
  const code = customCode || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  
  await Premium.create({
    code,
    expiresAt
  });
  
  return code;
}

/**
 * Resgata um código premium
 * @param {string} code 
 * @param {string} userId 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function redeemPremiumCode(code, userId) {
  const premium = await Premium.findOne({ code });
  
  if (!premium) {
    return { success: false, message: "Código inválido" };
  }
  
  if (premium.userId) {
    return { success: false, message: "Código já foi resgatado" };
  }
  
  if (premium.expiresAt < new Date()) {
    return { success: false, message: "Código expirado" };
  }
  
  // Verifica se usuário já tem premium ativo
  const existingPremium = await Premium.findOne({
    userId,
    expiresAt: { $gt: new Date() },
    redeemedAt: { $ne: null }
  });
  
  if (existingPremium) {
    return { success: false, message: "Você já tem premium ativo" };
  }
  
  premium.userId = userId;
  premium.redeemedAt = new Date();
  await premium.save();
  
  return { success: true, message: "Premium ativado com sucesso!" };
}

/**
 * Obtém informações detalhadas do premium do usuário
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
async function getPremiumInfo(userId) {
  return await Premium.findOne({
    userId,
    expiresAt: { $gt: new Date() },
    redeemedAt: { $ne: null }
  });
}

/**
 * Verifica se um código existe e é válido
 * @param {string} code 
 * @returns {Promise<{valid: boolean, message: string}>}
 */
async function validatePremiumCode(code) {
  const premium = await Premium.findOne({ code });
  
  if (!premium) {
    return { valid: false, message: "Código não encontrado" };
  }
  
  if (premium.userId) {
    return { valid: false, message: "Código já foi resgatado" };
  }
  
  if (premium.expiresAt < new Date()) {
    return { valid: false, message: "Código expirado" };
  }
  
  const daysLeft = Math.ceil((premium.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
  return { valid: true, message: `Código válido - ${daysLeft} dias` };
}

module.exports = {
  isPremiumUser,
  generatePremiumCode,
  redeemPremiumCode,
  getPremiumInfo,
  validatePremiumCode
};