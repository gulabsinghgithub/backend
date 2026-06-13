// const nodemailer = require("nodemailer");

// const sendOTPEmail = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"OTP Service" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "OTP Verification",
//       text: `Your OTP is ${otp}`,
//       html: `<h2>Your OTP is <b>${otp}</b></h2>`,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ OTP Email sent:", info.messageId);
//     return true;

//   } catch (error) {
//     console.log("❌ Nodemailer Error:", error.message);
//     throw error;
//   }
// };

// module.exports = sendOTPEmail;
// send an Email from NODEJS Server using nodemailer module
//This tutorial will show you how to use your Gmail account to send an email:

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
    auth:{
            user:"gulabsinghmailbox@gmail.com",
            pass:"dzzgqspucecpmhii",   // note: always keep password in .env file to keep it hidden
    }
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"OTP Service" <gulabsinghmailbox@gmail.com>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is <b>${otp}</b></h2>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.log("❌ Email Error:", error);
    return false;
  }
};

module.exports = sendOTPEmail;
// const nodemailer  = require('nodemailer'); // use mailer nodejs module
//    // details of to send from, to,  subject, text(message),


// const transporter = nodemailer.createTransport({
//     secure:true,
//     host:'smtp.gmail.com',
//     port:465,
//     auth:{
//             user:"gulabsinghmailbox@gmail.com",
//             pass:"dzzgqspucecpmhii",   // note: always keep password in .env file to keep it hidden
//     }
// }); // initialize create Transport service

// //sends the mail
// function sendMail(to, sub, msg){
//     transporter.sendMail({
//         subject:sub, // sender email address
//         to:to, // receiver email address)
//         html:msg
// });
// }

// sendMail("gulab@mdws.in","This is Subject","This is message body");
// sendOTPEmail("gulab@mdws.in", "123456")

