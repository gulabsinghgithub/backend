
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: "gulabsinghmailbox@gmail.com", // must verify this in SendGrid
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is <b>${otp}</b></h2>`,
    };

    await sgMail.send(msg);

    console.log("✅ OTP sent via SendGrid");
    return true;

  } catch (error) {
    console.log("❌ SendGrid Error:", error.response?.body || error.message);
    return false;
  }
};

module.exports = sendOTPEmail;
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   secure: true,
//   host: "smtp.gmail.com",
//   port: 465,
//   auth: {
//     user: "gulabsinghmailbox@gmail.com",
//     pass: "dzzgqspucecpmhii",
//   },
// });

// // sends OTP mail (same structure as your working function)
// function sendOTPEmail(to, otp) {
//   transporter.sendMail({
//     subject: "OTP Verification",
//     to: to,
//     html: `<h2>Your OTP is <b>${otp}</b></h2>`,
//   }, (err, info) => {
//     if (err) {
//       console.log("❌ Email Error:", err);
//     } else {
//       console.log("✅ OTP Email sent:", info.messageId);
//     }
//   });
// }

// module.exports = sendOTPEmail;

// sendOTPEmail("mailtogulab13@gmail.com", "123456")

