const express = require("express");
const router = express.Router();

require("../controllers/authcontroller");

router.post("/register", registerUser);

module.exports = router;