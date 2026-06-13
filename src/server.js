const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

// Connect Database FIRST and handle failure properly
connectDB()
  .then(() => {
    console.log("Database connected successfully 🚀");

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed ❌", err);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});