const express = require("express");

const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
} = require("../controllers/customerAuthController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerCustomer);

router.post("/login", loginCustomer);

router.get("/profile", authMiddleware, getCustomerProfile);

module.exports = router;