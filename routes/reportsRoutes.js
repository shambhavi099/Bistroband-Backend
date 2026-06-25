const express = require("express");

const router = express.Router();

const {
  getReportSummary,
  getPopularItems,
  getRevenueTrend
} = require("../controllers/reportsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware(["Manager"]),
  getReportSummary
);

router.get(
  "/revenue-trend",
  authMiddleware,
  roleMiddleware("Manager"),
  getRevenueTrend
);

router.get(
  "/popular-items",
  authMiddleware,
  roleMiddleware(["Manager"]),
  getPopularItems
);

module.exports = router;