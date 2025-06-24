// routes/expert.js
const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');

router.put('/update-settings/:expertId', async (req, res) => {
  const { chatFee, chatDurationMinutes } = req.body;
  try {
    const expert = await Expert.findByIdAndUpdate(
      req.params.expertId,
      { chatFee, chatDurationMinutes },
      { new: true }
    );
    if (!expert) return res.status(404).json({ success: false, message: "Expert not found" });
    res.json({ success: true, message: "Settings updated", expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }k
});

module.exports = router;
