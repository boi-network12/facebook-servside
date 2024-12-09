const express = require("express");
const { createImagePost, getUserPosts, deleteImagePost, likePost, createComment, getComments } = require("../controllers/ImagePostController");
const authenticate = require("../Middleware/authenticationMiddleware");
const { upload, uploadImageToCloudinary } = require("../Middleware/uploadImage");
const router = express.Router();

// 
router.post("/", authenticate, upload.array("images", 4), uploadImageToCloudinary, createImagePost);

//
router.get("/", authenticate, getUserPosts);

//
router.delete("/:postId", authenticate, deleteImagePost)

// for the like
router.post("/:postId/like", authenticate, likePost);

// for comment
router.post("/:postId/comment", authenticate, createComment);

// for fetching comment 
router.get("/:postId/comments", authenticate, getComments)

module.exports = router;