const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"OTP Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is <b>${otp}</b></h2>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.log("❌ Nodemailer Error:", error.message);
    throw error;
  }
};

module.exports = sendOTPEmail;