const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
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

// Add index for faster message history retrieval
messageSchema.index({ sender_id: 1, receiver_id: 1, timestamp: -1 });
messageSchema.index({ receiver_id: 1, sender_id: 1, timestamp: -1 });

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
