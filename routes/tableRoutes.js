const express = require("express");

const router = express.Router();

const {
  createTable,
  getAllTables,
  getTableById,
  updateTableStatus,
  deleteTable,
} = require("../controllers/tableController");

router.post("/", createTable);
router.get("/", getAllTables);
router.get("/:id", getTableById);
router.patch("/:id/status", updateTableStatus);
router.delete("/:id", deleteTable);

module.exports = router;