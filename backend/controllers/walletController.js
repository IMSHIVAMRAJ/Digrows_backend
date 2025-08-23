const crypto = require('crypto');
const razorpay = require('../utils/razorpay');
const User = require('../models/User');

// ✅ Add money manually
const addMoneyToWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const newTransaction = {
      type: 'credit',
      amount,
      status: 'success',
    };

    user.wallet += amount;
    user.transactions.push(newTransaction);
    await user.save();

    res.json({ success: true, message: "Money added successfully", wallet: user.wallet });
  } catch (err) {
    console.error("Error adding money:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Wallet balance check
const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, wallet: user.wallet });
  } catch (err) {
    console.error("Error fetching wallet balance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Razorpay: Create payment order
const createWalletOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `txn_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error creating wallet order:", err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

// ✅ Razorpay: Verify payment and update wallet
const verifyWalletPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.wallet += amount;
      await user.save();

      return res.status(200).json({ success: true, message: "Payment verified & wallet updated" });
    } catch (err) {
      console.error("Error verifying wallet payment:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
  } else {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  addMoneyToWallet,
  getWalletBalance,
  createWalletOrder,
  verifyWalletPayment
};
