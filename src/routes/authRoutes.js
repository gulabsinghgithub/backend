const express = require("express");
const router = express.Router();

const {
  registerUser,
  sendOTP,
  verifyOTP,
} = require("/controllers/authController");

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
console.log("Current file:", __filename);
console.log("Current folder:", __dirname);
router.post("/register", asyncHandler(registerUser));
router.post("/send-otp", asyncHandler(sendOTP));
router.post("/verify-otp", asyncHandler(verifyOTP));

module.exports = router;