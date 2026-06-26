const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  getOrderById,
  deleteOrder
} = require("../controllers/ordersController");

const authMiddleware  = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  createOrder
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Manager", "Chef", "Server"]),
  getAllOrders
);

router.get("/:id", getOrderById);

router.patch(
    "/:id",
    updateOrder
)

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["Manager", "Chef"]),
  updateOrderStatus
);

router.delete("/:id", deleteOrder);

module.exports = router;