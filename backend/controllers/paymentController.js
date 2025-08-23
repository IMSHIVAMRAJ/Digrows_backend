const razorpay = require("../utils/razorpay");
const User = require("../models/User");

// ✅ Create order to pay expert
exports.createOrder = async (req, res) => {
  const { userId, expertId } = req.body;

  try {
    const expert = await User.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    const amount = expert.chatFee * 100; // Convert to paisa

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Error creating payment order:", err);
    res.status(500).json({ success: false, message: "Payment order failed" });
  }
};


