const Expert = require("../models/Expert");
const jwt = require("jsonwebtoken");

// ✅ Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Login Expert
exports.loginExpert = async (req, res) => {
  try {
    const { email, password } = req.body;

    const expert = await Expert.findOne({ email, type: "expert" });
    if (!expert || !(await expert.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Expert login successful",
      token: generateToken(expert._id),
      expert,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login Mentor
exports.loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Expert.findOne({ email, type: "mentor" });
    if (!mentor || !(await mentor.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Mentor login successful",
      token: generateToken(mentor._id),
      mentor,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login Investor
exports.loginInvestor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const investor = await Expert.findOne({ email, type: "investor" });
    if (!investor || !(await investor.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Investor login successful",
      token: generateToken(investor._id),
      investor,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
