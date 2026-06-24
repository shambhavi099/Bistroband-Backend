const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
} = require("../controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Manager
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Manager"]),
  createMenuItem
);

// Everyone logged in
router.get(
  "/",
  authMiddleware,
  getAllMenuItems
);

router.get(
  "/:id",
  authMiddleware,
  getMenuItemById
);

// Manager
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Manager"]),
  updateMenuItem
);

// Manager & Chef
router.patch(
  "/:id/availability",
  authMiddleware,
  roleMiddleware(["Manager", "Chef"]),
  updateAvailability
);

// Manager
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Manager"]),
  deleteMenuItem
);

module.exports = router;