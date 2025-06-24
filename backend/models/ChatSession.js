// 📁 models/ChatSession.js
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
