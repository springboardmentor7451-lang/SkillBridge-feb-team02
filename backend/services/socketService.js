const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");
const Message = require("../models/message");
const Notification = require("../models/notification");

let io;
const userSockets = new Map(); // userId -> Set of socketIds (to support multiple devices)

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust as needed for production
      methods: ["GET", "POST"],
    },
  });

  // Authentication Middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({ email: decoded.email }).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`User connected: ${userId} (${socket.id})`);

    // Add socket to user's set
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join a private room for the user to handle targeted emits easily
    socket.join(userId);

    socket.on("send_message", async (data) => {
      try {
        const { receiver_id, content } = data;
        
        if (!receiver_id || !content) return;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
          return socket.emit("error", { message: "Invalid receiver ID" });
        }

        // Check if this is a new conversation and if the sender is allowed to start it
        if (socket.user.role === "volunteer") {
          const existingMessage = await Message.findOne({
            $or: [
              { sender_id: userId, receiver_id },
              { sender_id: receiver_id, receiver_id: userId }
            ]
          });

          if (!existingMessage) {
            return socket.emit("error", { 
              message: "Volunteers cannot initiate conversations. Please wait for the NGO to contact you." 
            });
          }
        }

        // Save message to DB
        const newMessage = await Message.create({
          sender_id: userId,
          receiver_id,
          content,
        });

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender_id", "name email role")
          .populate("receiver_id", "name email role");

        // Emit to receiver's room
        io.to(receiver_id).emit("receive_message", populatedMessage);
        
        // Emit confirmation back to sender (optional, but good for UI sync)
        socket.emit("message_sent", populatedMessage);

        // Notify receiver of new message
        sendNotification(receiver_id, {
          type: "message",
          message: `New message from ${socket.user.name}`,
          related_id: newMessage._id,
        });

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId} (${socket.id})`);
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const sendNotification = async (userId, notificationData) => {
  try {
    const { type, message, related_id } = notificationData;
    
    // Save to DB
    const notification = await Notification.create({
      user_id: userId,
      type,
      message,
      related_id,
    });

    // Emit real-time notification
    if (io) {
      io.to(userId.toString()).emit("new_notification", notification);
    }
    
    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendNotification,
};
