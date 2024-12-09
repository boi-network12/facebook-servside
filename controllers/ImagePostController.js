const Comment = require("../models/Comment");
const ImagePost = require("../models/ImagePost");
const User = require("../models/User"); // Import the User model
const { createNotification } = require("./NotificationController");

// Create an image post
exports.createImagePost = async (req, res) => {
    try {
        const { caption, audience } = req.body;

        // Fetch user info from the authenticated user (req.user is set by middleware)
        const user = await User.findById(req.user._id).select(
            "username profilePicture firstName lastName middleName gender bio location"
        );


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the post
        const newImagePost = new ImagePost({
            userId: user._id,
            images: req.images,
            caption,
            audience,
            user,
        });

        const savedPost = await newImagePost.save();



        // Include full user details in the response
        res.status(201).json({
            message: 'Post created successfully!',
            post: savedPost,
        });

    } catch (error) {
        console.error('Error creating image post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Fetch all  the posts for a user 
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await ImagePost.find({
            $or: [
                { userId: req.user._id },
                { audience: 'public' }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture firstName lastName bio location');

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



//Delete a post 
exports.deleteImagePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const deletePost = await ImagePost.findOneAndDelete({ _id: postId, userId: req.user._id })

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
        console.error('Error deleting image post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const post = await ImagePost.findById(postId);
        if (!post) return res.status(404).json({ message: "post not found" });

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId)
        }


        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post" });
    }
}

exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    try {
        // Find the post
        const post = await ImagePost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        // Fetch the user details
        const user = await User.findById(userId).select("username profilePicture firstName lastName")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // create comment
        const comment = new Comment({
            postId,
            userId,
            text,
            user: {
                username: user.username,
                profilePicture: user.profilePicture,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
        await comment.save();

        // create a notification for the user who posted the image
        if (post.userId.toString() !== userId.toString()) {
            await createNotification(post.userId, `${req.user.firstName || "Someone"} commented on your post`)
        }

        // Respond wth the created comment data
        const populatedComment = await Comment.findById(comment._id).populate(
            "userId",
            "username profilePicture firstName lastName"
        )

        res.status(200).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment" });
    }
}

exports.getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId }).populate("userId", "username profilePicture firstName lastName bio location gender");
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments" });
    }
}