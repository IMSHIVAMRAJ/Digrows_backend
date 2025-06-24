const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
  // password: String,
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

  chatFee: {
    type: Number,
    default: 100 // ₹100 default if expert doesn't set
  },
chatDurationMinutes: {
  type: Number,
  default: 30  // default 30 minutes 
}


});

module.exports = mongoose.model('Expert', ExpertSchema);
