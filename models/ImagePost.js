const mongoose = require("mongoose");

const ImagePostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            }
        }
    ],
    caption: {
        type: String,
    },
    audience: {
        type: String,
        enum: ['private', 'friends', 'public'],
        default: 'public'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('ImagePost', ImagePostSchema);