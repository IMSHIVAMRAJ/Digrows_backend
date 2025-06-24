// 📁 routes/chat.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ChatSession = require('../models/ChatSession');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ 1. Create Razorpay order
router.post('/start-expert-chat', async (req, res) => {
  const { expertId, userId, amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `chat_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// ✅ 2. Verify payment and create session
router.post('/verify-chat-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, expertId } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest === razorpay_signature) {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    const session = await ChatSession.create({
      user: userId,
      expert: expertId,
      expiresAt,
    });

    return res.json({ success: true, session });
  } else {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
