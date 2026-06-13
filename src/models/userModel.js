const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true, index: true },

    password: { type: String, required: true },

    country: String,
    state: String,
    city: String,
    pinCode: String,

    // 🔥 OTP SYSTEM FIELDS
    otp: { type: String },
    otpExpires: { type: Date },

    // 🔥 USER VERIFICATION STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// optional: remove sensitive data when sending response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  return user;
};

module.exports = mongoose.model("User", userSchema);