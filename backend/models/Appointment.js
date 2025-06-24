const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pitchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitch' },
  scheduledTime: Date,
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
