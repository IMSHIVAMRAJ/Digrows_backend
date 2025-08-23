// 📁 models/ChatSession.js
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert' },
   sessionType: {
  type: String,
  enum: ['chat', 'audio', 'video'],
  required: true
},
  isFree: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  durationMinutes: { type: Number, required: true }

});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
