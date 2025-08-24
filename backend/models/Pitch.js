// models/Pitch.js

const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  // You already have this
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String,
  pitchDeckUrl: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  // ADD THESE NEW FIELDS TO SUPPORT YOUR UI
  industry: String,
  stage: String, // e.g., 'Pre-seed', 'Seed', 'Series A'
  website: String,
  usp: String, // Or problemStatement, solutionStatement etc.
  fundingRequired: String,
  currentRevenue: String,

}, { timestamps: true }); // Using timestamps is good practice for 'submittedDate'

module.exports = mongoose.model('Pitch', pitchSchema);