const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { createNotification } = require("./NotificationController");


// Register a new User 
// Register a new User 
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, middleName, emailOrNumber, password, gender, dateOfBirth } = req.body;

        // Determine if emailOrNumber is an email or a number
        const isEmail = emailOrNumber.includes('@');
        let userQuery = {};

        if (isEmail) {
            userQuery.email = emailOrNumber;
        } else {
            userQuery.number = emailOrNumber;
        }

        // Check if email already exists
        const existingUser = await User.findOne(userQuery);
        if (existingUser) {
            return res.status(400).json({ message: "Email or number already exists." });
        }

        // Generate a hashed password
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate a unique username based on user ID
        const uid = uuidv4();
        const username = `user${uid}`;

        // Set default profile picture based on gender
        const defaultMaleProfilePicture = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Male_Avatar.jpg/800px-Male_Avatar.jpg?20201202061211"; // Replace with your actual URL
        const defaultFemaleProfilePicture = "https://thumbs.dreamstime.com/b/silhouette-adult-woman-female-avatar-social-media-icon-gray-inverted-silhouette-isolated-white-background-silhouette-326822234.jpg"; // Replace with your actual URL
        const defaultProfilePicture = gender.toLowerCase() === "male" ? defaultMaleProfilePicture : defaultFemaleProfilePicture;

        // Create a new User instance
        const newUser = new User({
            firstName,
            lastName,
            middleName,
            email: isEmail ? emailOrNumber : undefined,
            password: hashPassword,
            number: !isEmail ? emailOrNumber : undefined,
            username,
            gender,
            dateOfBirth,
            profilePicture: defaultProfilePicture
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Create a notification for the user
        const appName = "MyApp";
        const notificationMessage = `You have created your account on ${appName}`;
        const notificationTitle = "Welcome to MyApp"; // Include a title for the notification
        await createNotification(savedUser._id, notificationMessage, notificationTitle);

        // Generate a JWT token for the user 
        const token = jwt.sign({
            userId: savedUser._id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                profilePicture: savedUser.profilePicture,
                bio: savedUser.bio,
                location: savedUser.location,
                gender: savedUser.gender,
                dateOfBirth: savedUser.dateOfBirth,
                role: savedUser.role,
                status: savedUser.status,
                privacy: savedUser.privacy
            }
        });

    } catch (error) {
        console.error("Registration Error", error);
        res.status(500).json({
            message: "An error occurred while registering the user"
        });
    }
};


// Login an existing user
exports.loginUser = async (req, res) => {
    try {
        const { emailOrNumber, password } = req.body;

        // Check if emailOrNumber is an email or a number
        const isEmail = emailOrNumber.includes('@');
        let userQuery = {};

        if (isEmail) {
            userQuery.email = emailOrNumber;  // If it's an email, search by email
        } else {
            userQuery.number = emailOrNumber;  // If it's a number, search by number
        }

        // Find the user by email or number
        const user = await User.findOne(userQuery);

        // If user is not found, return error
        if (!user) {
            return res.status(400).json({ message: "Invalid Login credentials. Please try again." });
        }

        // Compare password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // create a notification for the user on login
        const notificationMessage = `Welcome back to MyApp!`;
        const notificationTitle = "Login Successful";
        await createNotification(user._id, notificationMessage, notificationTitle);

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Send response with user details and token
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                role: user.role,
                status: user.status,
                privacy: user.privacy
            }
        });

    } catch (error) {
        console.error("Login Error", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
};

// update profilePicture
exports.updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const newProfilePictureUrl = req.body.newProfilePictureUrl;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // save the new profile picture and store the old ones
        user.profilePicture.push({
            type: user.profilePicture,
            timestamp: Date.now(),
        });
        user.profilePicture = newProfilePictureUrl;

        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully",
            user: {
                profilePicture: user.profilePicture,
                profilePictureHistory: user.profilePictureHistory,
            }
        });

    } catch (error) {
        console.error("Error updating profile picture", error);
        res.status(500).json({ message: "An error occurred while updating the profile picture" });
    }
}
