const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
  password: String,
  address: {
    city: String,
    state: String,
    country: String,
  },
  skills: [String],
  type: { type: String, enum: ['investor', 'expert', 'mentor'] },
  rememberSettings: Boolean,
  companyName: String,
  website: String,
  officeAddress: String,
  gstin: String,
  registrationCertUrl: String,
  industryCategory: String,
});

module.exports = mongoose.model('Expert', ExpertSchema);
