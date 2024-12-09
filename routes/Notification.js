const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/NotificationController");
const router = express.Router();

// Route to get notifications for a specific user
router.get("/:userId", getNotifications);

// mark as read 
router.patch("/mark-as-read/:notificationId", markAsRead);

module.exports = router;
