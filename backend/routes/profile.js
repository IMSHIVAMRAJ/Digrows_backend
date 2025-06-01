const express = require('express');
const router = express.Router();
const upload = require('../utils/cloudinary');
const User = require('../models/User');
const {
  setupUserProfile,
  setupExpertProfile,
} = require('../controllers/profileController');

router.post('/user', upload.single('certificate'), setupUserProfile);
router.post('/expert', upload.single('registrationCert'), setupExpertProfile);
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp'); // password aur otp hide kar diye
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
