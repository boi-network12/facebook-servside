const express = require("express");
const { updateProfilePicture } = require("../controllers/authController");

const router = express.Router();

// Profile picture update route
router.put("/update-profile-picture", updateProfilePicture);

module.exports = router;