const express = require("express");
const { connectDB } = require("./config/db");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const jwtAuth = require("./middleware/jwtAuth");
const cors=require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", jwtAuth, userRouter);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await connectDB();
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed", error);
  }
});
