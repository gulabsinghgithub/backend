const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// const { registerUser } = require("../controllers/authcontroller");

// router.post("/register", registerUser);
const {
  registerUser,
  sendOTP,
  verifyOTP,
  loginUser,
  deleteUser,
  forgotPassword,
} = require("../controllers/authcontroller");

// Routes
router.post("/register", registerUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.delete(
  "/delete",
  authMiddleware,
  deleteUser
);
router.post("/forgot-password", forgotPassword);
module.exports = router;