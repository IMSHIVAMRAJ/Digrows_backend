const express = require('express');
const router = express.Router();
const {
  addMoneyToWallet,
  getWalletBalance,
  createWalletOrder,
  verifyWalletPayment
} = require('../controllers/walletController');

// ✅ Manual add money
router.post('/add-money', addMoneyToWallet);

// ✅ Wallet balance check
router.get('/balance/:userId', getWalletBalance);

// ✅ Razorpay: Create payment order
router.post('/create-order', createWalletOrder);

// ✅ Razorpay: Verify payment
router.post('/verify-payment', verifyWalletPayment);

module.exports = router;
