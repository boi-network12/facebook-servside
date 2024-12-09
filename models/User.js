const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    number: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    profilePicture: {
        type: String,  // URL for the profile picture
    },
    profilePictureHistory: [{
        type: String,  // URLs for previous profile pictures
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    bio: {
        type: String,
        maxlength: 160,  // Twitter-style bio length limit
    },
    location: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user',
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs for friends
        ref: 'User',
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs for followers
        ref: 'User',
    },
    caches: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    TimeStamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
    privacy: {
        type: String,
        enum: ['public', 'friends-only', 'private'],
        default: 'public',
    }
});




module.exports = mongoose.model("User", UserSchema);