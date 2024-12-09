const Notification = require("../models/Notification")


exports.createNotification = async (userId, message, title = "Notification") => {
    try {
        const newNotification = new Notification({
            userId,
            message,
            title,
            createdAt: new Date(),
        });

        await newNotification.save();

    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters
    try {
        const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
        return res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    const { notificationId } = req.params; // Get notificationId from the request parameters
    try {
        // FInd the notification and update its 'read' status
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true })

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ message: 'Error marking notification as read' });
    }
}

const deleteOldNotifications = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find and delete notifications older than 7 days
        const result = await Notification.deleteMany({
            timestamp: {
                $lt: sevenDaysAgo
            }
        })

        console.log(`${result.deletedCount} notifications deleted that were older than 7 days.`);
    } catch (error) {
        console.error('Error deleting old notifications:', error);
    }
}

setInterval(deleteOldNotifications, 24 * 60 * 60 * 1000);