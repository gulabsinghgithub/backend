const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// REGISTER API
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
      pinCode
    } = req.body;

    // 1. check required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // 2. check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 3. hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. create user in MongoDB
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      country,
      state,
      city,
      pinCode
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { registerUser };