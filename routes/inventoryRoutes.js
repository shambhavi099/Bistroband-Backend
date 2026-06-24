const express = require("express");

const router = express.Router();

const {
  createInventoryItem,
  getAllInventory,
  updateStock,
  restockLowStock,
  deleteInventoryItem
} = require("../controllers/inventory.controller");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Manager"]),
  createInventoryItem
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Manager", "Chef"]),
  getAllInventory
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["Manager", "Chef"]),
  updateStock
);

router.patch(
  "/restock",
  authMiddleware,
  roleMiddleware(["Manager"]),
  restockLowStock
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Manager"]),
  deleteInventoryItem
);

module.exports = router;