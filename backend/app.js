require('dotenv').config();
const express = require("express");
const { connectDB } = require("./config/db");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const opportunityRoutes = require("./routes/opportunity");
const applicationRoutes = require("./routes/application");
const messageRouter = require("./routes/message");
const matchRouter = require("./routes/match");
const notificationRouter = require("./routes/notification");
const jwtAuth = require("./middleware/jwtAuth");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", jwtAuth, userRouter);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", jwtAuth, applicationRoutes);
app.use("/api/messages", messageRouter);
app.use("/api/match", matchRouter);
app.use("/api/notifications", jwtAuth, notificationRouter);
app.get("/", (req, res) => {
  res.send("API is running!");
});

const http = require("http");
const { initSocket } = require("./services/socketService");

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await connectDB();
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed", error);
  }
});