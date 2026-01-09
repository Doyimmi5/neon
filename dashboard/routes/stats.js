const router = require("express").Router();
const CheckAuth = require("../auth/CheckAuth");
const { getSettings } = require("@schemas/Guild");
const Premium = require("@schemas/Premium");

// Statistics Dashboard
router.get("/", CheckAuth, async (req, res) => {
  try {
    const user = req.userInfos;
    const client = req.client;
    
    // Bot Statistics
    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const totalChannels = client.channels.cache.size;
    
    // Premium Statistics
    const totalPremiumUsers = await Premium.countDocuments({
      userId: { $ne: null },
      expiresAt: { $gt: new Date() }
    });
    
    const totalPremiumCodes = await Premium.countDocuments();
    
    // User's Guilds with Bot
    const userGuilds = user.guilds.filter(guild => 
      client.guilds.cache.has(guild.id) && 
      (guild.permissions & 0x20) === 0x20 // MANAGE_GUILD permission
    );
    
    // Recent Activity (mock data)
    const recentActivity = [
      { action: "Servidor adicionado", guild: "Servidor Exemplo", time: "2 horas atrás" },
      { action: "Comando executado", guild: "Outro Servidor", time: "5 horas atrás" },
      { action: "Configuração alterada", guild: "Meu Servidor", time: "1 dia atrás" },
    ];
    
    res.render("stats", {
      user,
      stats: {
        totalGuilds,
        totalUsers,
        totalChannels,
        totalPremiumUsers,
        totalPremiumCodes,
        userGuilds: userGuilds.length
      },
      userGuilds: userGuilds.slice(0, 5), // Show only first 5
      recentActivity,
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

// API endpoint for real-time stats
router.get("/api", CheckAuth, async (req, res) => {
  try {
    const client = req.client;
    
    const stats = {
      guilds: client.guilds.cache.size,
      users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      channels: client.channels.cache.size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      premiumUsers: await Premium.countDocuments({
        userId: { $ne: null },
        expiresAt: { $gt: new Date() }
      })
    };
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;