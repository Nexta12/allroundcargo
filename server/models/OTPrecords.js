const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: String,
  hashedOtp: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("Category", otpSchema);
