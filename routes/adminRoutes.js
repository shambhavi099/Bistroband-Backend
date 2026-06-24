const express = require("express");
const router = express.Router();

const {
  getSystemConfig,
  updateSystemConfig,
  getPromoCampaigns,
  createPromoCampaign,
  togglePromoCampaignStatus,
  deletePromoCampaign,
  getAuditLogs,
  createAuditLog,
  deleteAuditLog,
  clearAuditLogs,
  factoryReset
} = require("../controllers/adminController");

router.get("/config", getSystemConfig);
router.put("/config", updateSystemConfig);

router.get("/promos", getPromoCampaigns);
router.post("/promos", createPromoCampaign);
router.patch("/promos/:id", togglePromoCampaignStatus);
router.delete("/promos/:id", deletePromoCampaign );

router.get("/audit", getAuditLogs);
router.post("/audit", createAuditLog);
router.delete("/audit/:id", deleteAuditLog);
router.delete("/audit", clearAuditLogs)

router.delete("/factory-reset", factoryReset);

module.exports = router;