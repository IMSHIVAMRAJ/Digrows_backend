const User = require('../models/User');
const Expert = require('../models/Expert');
const bcrypt = require('bcryptjs');

// 🧑‍🏠 Setup normal user profile
exports.setupUserProfile = async (req, res) => {
  try {
    const {
      name, phone, email, skills, type, businessName, website,
      businessCategory, city, state, country, rememberSettings,
    } = req.body;

    const certificateUrl = req.file?.path;

    const user = await User.findOneAndUpdate(
      { phone },
      {
        name,
        email,
        skills,
        type,
        address: { city, state, country },
        businessName: type === 'startup-founder' ? businessName : undefined,
        website: type === 'startup-founder' ? website : undefined,
        businessCategory: type === 'startup-founder' ? businessCategory : undefined,
        certificateUrl: type === 'startup-founder' ? certificateUrl : undefined,
        rememberSettings,
      },
      { new: true }
    );

    res.status(200).json({ message: 'User profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};

// 🧠 Setup expert profile
exports.setupExpertProfile = async (req, res) => {
  try {
    const {
      name, phone, email, password, postalAddress,city, state, country,
      skills, type, rememberSettings,
      companyName, website, officeAddress, gstin, industryCategory,
      chatFee, chatDurationMinutes, category
    } = req.body;

    // check if email already exists
    const existing = await Expert.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const registrationCertUrl = req.file?.path;

    const expert = new Expert({
      name,
      phone,
      email,
      password: hashedPassword,
      skills,
      type,
      postalAddress,
      address: { city, state, country },
      companyName,
      website,
      officeAddress,
      gstin,
      registrationCertUrl,
      industryCategory,
      rememberSettings,
      chatFee,
      chatDurationMinutes,
      category
    });

    await expert.save();
    res.status(201).json({ message: "Expert profile created", expert });
  } catch (err) {
    console.error("Error creating expert:", err);
    res.status(500).json({ message: "Expert creation failed" });
  }
};

// 📋 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp');
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔍 Get specific expert profile
exports.getExpertProfile = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id, '-password');
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    res.json({ success: true, expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✏️ Update expert details (chatFee, etc.)
exports.updateExpert = async (req, res) => {
  try {
    const { chatFee } = req.body;
    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      { $set: { chatFee } },
      { new: true }
    );
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    res.json({ success: true, message: 'Expert updated', expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 🧑‍🏫 Get all mentors
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Expert.find({ type: "mentor" }, "-password");
    res.status(200).json({ success: true, mentors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 💼 Get all investors
exports.getAllInvestors = async (req, res) => {
  try {
    const investors = await Expert.find({ type: "investor" }, "-password");
    res.status(200).json({ success: true, investors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧑‍🏫 Get mentor profile by ID
exports.getMentorProfile = async (req, res) => {
  try {
    const mentor = await Expert.findOne({ _id: req.params.id, type: "mentor" }, "-password");
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    res.json({ success: true, mentor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 💼 Get investor profile by ID
exports.getInvestorProfile = async (req, res) => {
  try {
    const investor = await Expert.findOne({ _id: req.params.id, type: "investor" }, "-password");
    if (!investor) return res.status(404).json({ success: false, message: "Investor not found" });
    res.json({ success: true, investor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✏️ Update mentor details
exports.updateMentor = async (req, res) => {
  try {
    const { chatFee } = req.body;
    const mentor = await Expert.findOneAndUpdate(
      { _id: req.params.id, type: "mentor" },
      { $set: { chatFee } },
      { new: true }
    );
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    res.json({ success: true, message: "Mentor updated", mentor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✏️ Update investor details
exports.updateInvestor = async (req, res) => {
  try {
    const { chatFee } = req.body;
    const investor = await Expert.findOneAndUpdate(
      { _id: req.params.id, type: "investor" },
      { $set: { chatFee } },
      { new: true }
    );
    if (!investor) return res.status(404).json({ success: false, message: "Investor not found" });
    res.json({ success: true, message: "Investor updated", investor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
