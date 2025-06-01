const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate Access Token (Expires in 15m)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (Expires in 7 days)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
