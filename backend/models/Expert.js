const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
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
  postalAddress:String,
  officeAddress: String,
  gstin: String,
  category: String,
  registrationCertUrl: String,
  industryCategory: String,
  isFree: { type: Boolean, default: false },
  chatFee: {
    type: Number,
    default: 100 // ₹100 default if expert doesn't set
  },
chatDurationMinutes: {
  type: Number,
  default: 30  // default 30 minutes 
},
 audioFee: { type: Number, default: 0 },
  audioDurationMinutes: { type: Number, default: 30 },

  videoFee: { type: Number, default: 0 },
  videoDurationMinutes: { type: Number, default: 30 },


}, { timestamps: true });
// ✅ password hash before save
expertSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ compare password
expertSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('Expert', expertSchema);
