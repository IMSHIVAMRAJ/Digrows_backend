const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/paymentController");

// ✅ Create order to pay expert
router.post("/create-order", createOrder);

module.exports = router;
