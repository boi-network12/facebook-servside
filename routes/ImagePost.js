const express = require("express");
const { createImagePost, getUserPosts, deleteImagePost } = require("../controllers/ImagePostController");
const authenticate = require("../Middleware/authenticationMiddleware");
const upload = require("../Middleware/uploadImage");
const router = express.Router();

// 
router.post("/", authenticate, upload.array("images", 4), createImagePost);

//
router.get("/", authenticate, getUserPosts);

//
router.delete("/:postId", authenticate, deleteImagePost)

module.exports = router;