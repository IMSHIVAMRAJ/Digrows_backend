const Razorpay = require('razorpay');
const crypto = require('crypto');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ✅ Create Razorpay order for paid expert
exports.startExpertChat = async (req, res) => {
  const { expertId, userId, amount } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: `chat_${Date.now()}`,
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};


// ✅ Verify payment and create paid session
exports.verifySessionPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, expertId, sessionType } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest === razorpay_signature) {
    try {
      const expert = await User.findById(expertId);

      let duration = 30;
      if (sessionType === 'chat') duration = expert.chatDurationMinutes;
      if (sessionType === 'audio') duration = expert.audioDurationMinutes;
      if (sessionType === 'video') duration = expert.videoDurationMinutes;

      const expiresAt = new Date(Date.now() + duration * 60 * 1000);
      const session = await ChatSession.create({
        user: userId,
        expert: expertId,
        expiresAt,
        isFree: false,
        sessionType,
        durationMinutes: duration,
      });

      return res.json({ success: true, session });
    } catch (err) {
      console.error("Session creation error:", err);
      return res.status(500).json({ success: false, message: 'Failed to create session' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};


// ✅ Create Razorpay order for paid expert session
exports.startExpertSession = async (req, res) => {
  const { expertId, userId, sessionType } = req.body;

  try {
    const expert = await User.findById(expertId);
    if (!expert || expert.role !== 'expert') {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // pick price based on type
    let amount = 0;
    let duration = 30; // fallback

    if (sessionType === 'chat') {
      amount = expert.chatFee;
      duration = expert.chatDurationMinutes;
    } else if (sessionType === 'audio') {
      amount = expert.audioFee;
      duration = expert.audioDurationMinutes;
    } else if (sessionType === 'video') {
      amount = expert.videoFee;
      duration = expert.videoDurationMinutes;
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `${sessionType}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, sessionType, duration });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};
