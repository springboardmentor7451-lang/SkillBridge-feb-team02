const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const jwtAuth = require("../middleware/jwtAuth");

// GET /api/notifications - Get all notifications for the current user
router.get("/", jwtAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch("/:id/read", jwtAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch("/read-all", jwtAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
