require("dotenv").config();

const sendOTPEmail = require("./src/services/sendOTPEmail"); // adjust path

(async () => {
  try {
    const result = await sendOTPEmail(
      "gulab@mdws.in",
      "123456"
    );

    console.log("RESULT:", result);
  } catch (err) {
    console.log("ERROR:", err);
  }
})();