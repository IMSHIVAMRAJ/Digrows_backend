// 📂 routes/profile.js

const express = require('express');
const router = express.Router();
const upload = require('../utils/cloudinary');
const User = require('../models/User');
const Expert = require('../models/Expert');

const {
  setupUserProfile,
  setupExpertProfile,
} = require('../controllers/profileController');

// 🧑‍🏠 Route to setup normal user profile
router.post('/user', upload.single('certificate'), setupUserProfile);

// 🧠 Route to setup expert profile (includes chatFee)
router.post('/expert', upload.single('registrationCert'), setupExpertProfile);

// 📋 Route to get all users (excluding password & otp)
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp');
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔍 Route to get specific expert profile
router.get('/expert/:id', async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id, '-password');
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✏️ Route to update expert chatFee (and optionally other fields)
router.patch('/expert/:id', async (req, res) => {
  try {
    const { chatFee } = req.body;
    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      { $set: { chatFee } },
      { new: true }
    );
    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });
    res.json({ success: true, message: 'Expert updated', expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
