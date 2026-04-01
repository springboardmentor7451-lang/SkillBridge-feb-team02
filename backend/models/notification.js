const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "application_status", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    related_id: {
      type: mongoose.Schema.Types.ObjectId, // Can be application_id or message_id
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for getting unread notifications for a user
notificationSchema.index({ user_id: 1, read: 1, timestamp: -1 });

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;
