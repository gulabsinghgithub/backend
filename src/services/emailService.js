const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
    html: `<h2>Your OTP is <b>${otp}</b></h2>`,
  };

  try {
    await sgMail.send(msg);
    console.log("OTP email sent via SendGrid");
  } catch (error) {
    console.log("SendGrid error:", error.response?.body || error.message);
  }
};

module.exports = sendOTPEmail;