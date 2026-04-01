const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const jwtAuth = require("../middleware/jwtAuth");

// GET /api/messages/conversations - Fetch list of users with whom the current user has messages
router.get("/conversations", jwtAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .sort({ timestamp: -1 })
      .populate("sender_id", "name email role")
      .populate("receiver_id", "name email role");

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.sender_id._id.toString() === userId.toString() 
        ? msg.receiver_id 
        : msg.sender_id;
      
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
        });
      }
    });

    res.json({
      success: true,
      data: Array.from(conversationsMap.values()),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/messages/:userId - Fetch conversation history with a specific user
router.get("/:userId", jwtAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!require("mongoose").Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender_id: currentUserId, receiver_id: userId },
        { sender_id: userId, receiver_id: currentUserId },
      ],
    })
      .sort({ timestamp: 1 }) // Chronological order
      .populate("sender_id", "name email role")
      .populate("receiver_id", "name email role");

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
