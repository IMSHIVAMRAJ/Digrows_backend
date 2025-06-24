const jwt = require('jsonwebtoken'); // ✅ Don't forget this!
const twilio = require('twilio');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  try {
    await twilioClient.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: `+91${phone}`, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP send failed' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: `+91${phone}`, code: otp });

    if (verification.status === 'approved') {
      let user = await User.findOne({ phone });

      if (user) {
        // ✅ Existing user → login
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          role: user.role,
          user
        });
      } else {
        // 🆕 New user → continue to registration
        return res.status(200).json({
          message: 'OTP verified. Please complete registration.',
          verified: true,
          phone
        });
      }
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

exports.googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) user = await new User({ email, name }).save();

    res.status(200).json({ message: 'Google login success', user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};
