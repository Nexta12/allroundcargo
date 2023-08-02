const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 4,
      trim: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      email: true,
      trim: true,
    },
    password: {
      type: String,
      min: 6,
    },
    phone: {
      type: String,
      max: 15,
    },
    isAdmin: {
        type: Boolean, default: true 
    },
    profilePic: {
      type: String,
      default: "man.png",
    },
    address: {
      type: String,
    },
    // verified: Boolean,
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
