const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Counter = require("../models/counterModel");
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

    // Generate next userId starting from 1000
    const counter = await Counter.findByIdAndUpdate(
      "userId",
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      }
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: counter.seq,
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

    return res.status(201).json({
      message: "User registered successfully. Now send OTP.",
      userId: user.userId,
      mongoId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// LOGIN API
// ===============================
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate input
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        message: "Email/Phone and Password are required",
      });
    }

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check account verification
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your account first",
      });
    }

    // Check if custom userId exists
    if (!user.userId) {
      return res.status(400).json({
        message: "User ID not found. Please contact support.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Generate JWT Token using custom userId
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Prepare user data
    const userData = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      state: user.state,
      city: user.city,
      pinCode: user.pinCode,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId, email, phone } = req.body;

    if (!userId && !email && !phone) {
      return res.status(400).json({
        message: "Please provide userId, email or phone",
      });
    }

    const query = {
      $or: [],
    };

    if (userId) {
      query.$or.push({ userId: Number(userId) });
      query.$or.push({ _id: userId }); // supports Mongo ObjectId also
    }

    if (email) {
      query.$or.push({ email });
    }

    if (phone) {
      query.$or.push({ phone });
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.deleteOne({
      _id: user._id,
    });

    return res.status(200).json({
      message: "Account deleted successfully",
      deletedUser: {
        userId: user.userId,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const sendOTP = async (req, res) => {
  try {
    console.log("🔥 API HIT");

    const { email } = req.body;
    console.log("EMAIL:", email);

    if (!email) {
      return res.status(400).json({ message: "Email missing" });
    }

    const otp = generateOTP();
    console.log("OTP:", otp);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, isVerified: false });
    }

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("🚀 Sending email...");
    await sendOTPEmail(email, otp);
    console.log("✅ Email sent");
console.log("BODY:", req.body);
    return res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log("❌ ERROR:", error);
    return res.status(500).json({ message: error.message });
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
  loginUser,
  deleteUser,
};

// require("dotenv").config();

// console.log("JWT_SECRET =", process.env.JWT_SECRET);