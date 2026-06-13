const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },

    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: null, unique: true, sparse: true },

    password: { type: String, default: null },

    country: String,
    state: String,
    city: String,
    pinCode: String,

    otp: String,
    otpExpires: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// remove sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  return user;
};

module.exports = mongoose.model("User", userSchema);