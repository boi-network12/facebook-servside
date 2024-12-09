const ImagePost = require("../models/ImagePost");
const User = require("../models/User"); // Import the User model

// Create an image post
exports.createImagePost = async (req, res) => {
    try {
        const { caption, audience } = req.body;

        if (!req.files || !caption) {
            return res.status(400).json({ message: "Caption and images are required." });
        }

        const images = req.files.map((file) => ({
            url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        }));

        // Check if images exceed the limit
        if (images.length > 4) {
            return res.status(400).json({ message: "You can only upload up to 4 images." });
        }

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
            images,
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
        const posts = await ImagePost.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture firstName lastName bio location'); // Populate user details

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