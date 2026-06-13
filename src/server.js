import dotenv from "dotenv";
dotenv.config();
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});