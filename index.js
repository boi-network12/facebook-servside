const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth');
const profilePicture = require('./routes/profilePicture');
const notificationRoutes = require('./routes/Notification');
const imagePost = require("./routes/ImagePost");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// CORS middleware configuration
const allowedOrigins = [
    "http://localhost:3000", // Local development
    "https://facebook-servside.onrender.com" // Deployed Render app
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile-picture', profilePicture);
app.use("/api/notifications", notificationRoutes);
app.use("/api/image-post", imagePost);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
