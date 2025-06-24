const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
  address: {
    city: String,
    state: String,
    country: String,
  },
  skills: [String],
  type: { type: String, enum: ['startup-founder', 'freelancer'] },
  businessName: String,
  website: String,
  businessCategory: String,
  certificateUrl: String,
  rememberSettings: Boolean,

  role: {
    type: String,
    enum: ['user', 'expert'], 
    default: 'user'
  },

  
team: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }
],
wallet: {
  type: Number,
  default: 0
},

transactions: [
  {
    type: {
      type: String, // 'credit' or 'debit'
    },
    amount: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String, // pending, success, failed
      default: 'pending'
    }
  }
]

});

module.exports = mongoose.model('User', UserSchema);
