const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String,
  problemStatement: String,
  solutionStatement: String,
  teamIntroduction: String,
  founderLinkedin: String,
  pitchDeckUrl: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Pitch', pitchSchema);
