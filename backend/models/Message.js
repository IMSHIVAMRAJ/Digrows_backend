// 📁 models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel"
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["User", "Expert"]
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverModel"
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["User", "Expert"]
  },

  content: { type: String, required: true },
  messageType: { type: String, enum: ["text", "image", "file"], default: "text" },

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
