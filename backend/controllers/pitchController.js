const Pitch = require('../models/Pitch');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Investor = require("../models/Expert");
const fs = require('fs');

// ✅ Pitch Submission by Startup
exports.uploadPitch = async (req, res) => {
  const { companyName, problemStatement, solutionStatement, teamIntroduction, founderLinkedin } = req.body;
  const pitchDeckUrl = req.file?.path;

  try {
    const pitch = await Pitch.create({
      userId: req.user.id,
      companyName,
      problemStatement,
      solutionStatement,
      teamIntroduction,
      founderLinkedin,
      pitchDeckUrl
    });

    res.status(201).json({ success: true, pitch });
  } catch (err) {
    res.status(500).json({ success: false, message: "Pitch submission failed", err });
  }
};

// ✅ Admin can view all pitches
exports.getPitches = async (req, res) => {
  const pitches = await Pitch.find().populate('userId');
  res.json(pitches);
};

// ✅ Admin can accept/reject pitch
exports.reviewPitch = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const pitch = await Pitch.findByIdAndUpdate(id, { status }, { new: true });
  res.json({ success: true, pitch });
};

// ✅ Get all investors (to show on frontend after pitch approval)
exports.getAcceptedInvestors = async (req, res) => {
  const investors = await User.find({ type: 'investor' });
  res.json({ success: true, investors });
};

// ✅ Book appointment with investor
exports.bookAppointment = async (req, res) => {
  const { investorId, dateTime } = req.body;

  try {
    // 🔍 1. Check if investor exists
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found"
      });
    }

    // ✅ 2. Create appointment
    const appointment = await Appointment.create({
      startupId: req.user.id,
      investorId,
      dateTime,
      status: "scheduled"
    });

    res.status(201).json({ success: true, appointment });

  } catch (err) {
    res.status(500).json({ success: false, message: "Booking failed", err });
  }
};

// ✅ Get all appointments for logged-in startup
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ startupId: req.user.id })
      .populate('investorId', 'name email');
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
};
