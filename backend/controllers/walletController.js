const User = require('../models/User');

const addMoneyToWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Simulate successful payment (in real app, use Razorpay/Stripe)
    const newTransaction = {
      type: 'credit',
      amount,
      status: 'success',
    };

    // Update wallet and add transaction
    user.wallet += amount;
    user.transactions.push(newTransaction);
    await user.save();

    res.json({ success: true, message: "Money added successfully", wallet: user.wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addMoneyToWallet };
