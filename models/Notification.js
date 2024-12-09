const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: new Date,
    },
    title: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);