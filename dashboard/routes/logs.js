const router = require("express").Router();
const CheckAuth = require("../auth/CheckAuth");
const { OWNER_IDS } = require("@root/config");

// Logs Dashboard (Owner only)
router.get("/", CheckAuth, async (req, res) => {
  try {
    const user = req.userInfos;
    
    if (!OWNER_IDS.includes(user.id)) {
      return res.status(403).render("403", {
        user,
        currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      });
    }
    
    // Mock logs data (in real implementation, you'd read from log files or database)
    const logs = [
      {
        level: "INFO",
        message: "Bot iniciado com sucesso",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        category: "SYSTEM"
      },
      {
        level: "WARN",
        message: "Comando executado com erro menor",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        category: "COMMAND"
      },
      {
        level: "ERROR",
        message: "Falha na conexão com API externa",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        category: "API"
      },
      {
        level: "INFO",
        message: "Novo servidor adicionado: Servidor Exemplo",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        category: "GUILD"
      },
      {
        level: "INFO",
        message: "Premium ativado para usuário: user#1234",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        category: "PREMIUM"
      }
    ];
    
    const logStats = {
      total: logs.length,
      errors: logs.filter(log => log.level === "ERROR").length,
      warnings: logs.filter(log => log.level === "WARN").length,
      info: logs.filter(log => log.level === "INFO").length
    };
    
    res.render("logs", {
      user,
      logs,
      logStats,
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

// API endpoint for real-time logs
router.get("/api", CheckAuth, async (req, res) => {
  try {
    const user = req.userInfos;
    
    if (!OWNER_IDS.includes(user.id)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    
    const { level, category, limit = 50 } = req.query;
    
    // Mock filtered logs (in real implementation, filter from actual logs)
    let logs = [
      {
        level: "INFO",
        message: "Novo log em tempo real",
        timestamp: new Date().toISOString(),
        category: "SYSTEM"
      }
    ];
    
    if (level) {
      logs = logs.filter(log => log.level === level.toUpperCase());
    }
    
    if (category) {
      logs = logs.filter(log => log.category === category.toUpperCase());
    }
    
    res.json(logs.slice(0, parseInt(limit)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;