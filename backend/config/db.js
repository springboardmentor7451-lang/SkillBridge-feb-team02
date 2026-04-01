const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (mongoose.connection.readyState === 2) {
    console.log("DB connecting...");
    return mongoose.connection;
  }
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("DB connected through config");
    return conn;
  } catch (e) {
    console.error("DB connection error:", e);
    throw e;
  }
};

module.exports = { connectDB };
