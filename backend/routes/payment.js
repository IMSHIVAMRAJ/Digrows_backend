const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const User = require("../models/User");

// Create order to pay expert
router.post("/create-order", async (req, res) => {
  const { userId, expertId } = req.body;

  try {
    const expert = await User.findById(expertId);
    if (!expert) return res.status(404).json({ success: false, message: "Expert not found" });

    const amount = expert.chatFee * 100; // Razorpay needs paisa not rupees

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment order failed" });
  }
});

module.exports = router;
