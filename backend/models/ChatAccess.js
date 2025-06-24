// models/ChatAccess.js
const mongoose = require('mongoose');

const chatAccessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  accessExpiresAt: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChatAccess', chatAccessSchema);
