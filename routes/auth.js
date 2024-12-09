const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

// route for registering a new user
router.post('/register', registerUser);

// route for logging in an existing user
router.post('/login', loginUser)

module.exports = router;
