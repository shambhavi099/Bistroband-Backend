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
  clearAuditLogs
} = require("../controllers/adminController");

router.get("/config", getSystemConfig);
router.put("/config", updateSystemConfig);

router.get("/promos", getPromoCampaigns);
router.post("/promos", createPromoCampaign);
router.patch("/promos/:id", togglePromoCampaignStatus);
router.delete("/promos/:id", deletePromoCampaign );

router.get("/audit-logs", getAuditLogs);
router.post("/audit-logs", createAuditLog);
router.delete("/audit-logs/:id", deleteAuditLog);
router.delete("/audit-logs", clearAuditLogs)

module.exports = router;