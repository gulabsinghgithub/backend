const express = require("express");
const router = express.Router();

// const { registerUser } = require("../controllers/authcontroller");

// router.post("/register", registerUser);
const {
  registerUser,
  sendOTP,
  verifyOTP,
} = require("../controllers/authcontroller");

// Routes
router.post("/register", registerUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;