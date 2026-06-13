const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourmail@gmail.com",
    pass: "your_app_password",
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: "yourmail@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
};

module.exports = sendOTPEmail;