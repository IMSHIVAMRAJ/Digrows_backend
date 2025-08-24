// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },  // Razorpay payment id ya apna unique id
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: "Expert" }, // agar expert ke liye hai
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["success", "pending", "failed"], 
    default: "pending" 
  },
  paymentMethod: { type: String }, // e.g., "razorpay", "credit card"
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
