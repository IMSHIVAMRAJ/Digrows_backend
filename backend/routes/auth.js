const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, googleSignIn } = require('../controllers/authController');
const {
  setupUserProfile,
  setupExpertProfile
} = require("../controllers/profileController");
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google-signin', googleSignIn);


module.exports = router;
