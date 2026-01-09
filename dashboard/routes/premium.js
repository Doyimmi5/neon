const router = require("express").Router();
const CheckAuth = require("../auth/CheckAuth");
const Premium = require("@schemas/Premium");
const { isPremiumUser, generatePremiumCode, redeemPremiumCode } = require("@handlers/premium");
const { OWNER_IDS } = require("@root/config");

// Premium Dashboard
router.get("/", CheckAuth, async (req, res) => {
  try {
    const user = req.userInfos;
    const hasPremium = await isPremiumUser(user.id);
    const isOwner = OWNER_IDS.includes(user.id);
    
    let premiumInfo = null;
    let stats = null;
    
    if (hasPremium) {
      premiumInfo = await Premium.findOne({
        userId: user.id,
        expiresAt: { $gt: new Date() },
        redeemedAt: { $ne: null }
      });
    }
    
    if (isOwner) {
      const totalCodes = await Premium.countDocuments();
      const activePremium = await Premium.countDocuments({
        userId: { $ne: null },
        expiresAt: { $gt: new Date() }
      });
      const availableCodes = await Premium.countDocuments({
        userId: null,
        expiresAt: { $gt: new Date() }
      });
      
      stats = { totalCodes, activePremium, availableCodes };
    }
    
    res.render("premium", {
      user,
      hasPremium,
      premiumInfo,
      isOwner,
      stats,
      currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("500", {
      user: req.userInfos,
      currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
  }
});

// Redeem Premium Code
router.post("/redeem", CheckAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.userInfos;
    
    if (!code) {
      return res.json({ success: false, message: "Código é obrigatório" });
    }
    
    const result = await redeemPremiumCode(code, user.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro interno do servidor" });
  }
});

// Generate Premium Code (Owner only)
router.post("/generate", CheckAuth, async (req, res) => {
  try {
    const user = req.userInfos;
    
    if (!OWNER_IDS.includes(user.id)) {
      return res.json({ success: false, message: "Acesso negado" });
    }
    
    const { days, amount, customCode } = req.body;
    const daysNum = parseInt(days) || 30;
    const amountNum = parseInt(amount) || 1;
    
    if (daysNum < 1 || daysNum > 365) {
      return res.json({ success: false, message: "Dias deve ser entre 1 e 365" });
    }
    
    if (amountNum < 1 || amountNum > 50) {
      return res.json({ success: false, message: "Quantidade deve ser entre 1 e 50" });
    }
    
    const codes = [];
    
    if (customCode) {
      if (customCode.length < 5) {
        return res.json({ success: false, message: "Código personalizado deve ter pelo menos 5 caracteres" });
      }
      const code = await generatePremiumCode(daysNum, customCode);
      codes.push(code);
    } else {
      for (let i = 0; i < amountNum; i++) {
        const code = await generatePremiumCode(daysNum);
        codes.push(code);
      }
    }
    
    res.json({ success: true, codes, days: daysNum });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao gerar códigos" });
  }
});

module.exports = router;