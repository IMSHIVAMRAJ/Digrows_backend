const express = require('express');
const router = express.Router();
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { addMoneyToWallet } = require('../controllers/walletController');

// ✅ Route to manually add money (old way - still kept if needed)
router.post('/add-money', addMoneyToWallet);

// ✅ Wallet balance check
router.get('/balance/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, wallet: user.wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Razorpay: Create payment order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // in paise
    currency: 'INR',
    receipt: `txn_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

// ✅ Razorpay: Verify payment and update wallet
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Verified -> Update wallet
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.wallet += amount;
      await user.save();

      return res.status(200).json({ success: true, message: "Payment verified & wallet updated" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
  } else {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
