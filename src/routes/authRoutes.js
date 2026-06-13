const express = require("express");
const router = express.Router();

const {
  registerUser,
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;