const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// Connect Database THEN start server
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