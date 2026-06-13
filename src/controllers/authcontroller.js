const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendOTPEmail = require("../services/emailService");

// ✅ OTP GENERATOR
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ===============================
// REGISTER API (FIXED WITH OTP)
// ===============================
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      state,
      city,
      pinCode,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      country,
      state,
      city,
      pinCode,
      isVerified: false,
    });

    res.status(201).json({
      message: "User registered successfully. Now send OTP.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    // 2. generate OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 min

    // 3. save OTP in DB
    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    // 4. send email
    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2. already verified check
    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    // 3. check OTP exists
    if (!user.otp) {
      return res.status(400).json({
        message: "OTP not found. Please request again.",
      });
    }

    // 4. check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // 5. check expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // 6. verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  sendOTP,
  verifyOTP,
};