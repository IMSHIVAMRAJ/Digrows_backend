const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, select: false }, // Password should not be returned by default
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

   teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // accepted team members
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // pending requests
  hasUsedFreeTrial: { type: Boolean, default: false },

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
