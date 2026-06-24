const express = require("express");

const router = express.Router();

const {
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment,
  clearPayments
} = require("../controllers/paymentController");

// Get all payments
router.get("/", getPayments);

// Get single payment
router.get("/:id", getPaymentById);

// Create payment
router.post("/", createPayment);

// Delete payment
router.delete("/:id", deletePayment);

//Clear All Data
router.delete("/", clearPayments);

module.exports = router;