const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    // ✅ Check if there is a valid ChatSession
    const session = await ChatSession.findOne({
      $or: [
        { user: senderId, expert: receiverId },
        { user: receiverId, expert: senderId }, // in case expert is sending back
      ],
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'No active chat session. Please start a session first.',
      });
    }

    // ✅ Save the message
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    res.status(200).json({
      success: true,
      message: 'Message sent!',
      data: newMessage,
    });

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
