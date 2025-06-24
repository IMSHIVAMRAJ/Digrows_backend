const Message = require('../models/Message');
// const ChatAccess = require('../models/ChatAccess');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const isExpert = receiver.role === 'expert';

    if (isExpert) {
      const access = await ChatAccess.findOne({
        userId: senderId,
        expertId: receiverId,
        expiresAt: { $gt: new Date() } // 👈 valid access check
      });

      if (!access) {
        return res.status(403).json({
          success: false,
          message: 'Chat access expired or not available. Please purchase to chat with expert.',
        });
      }
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
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
