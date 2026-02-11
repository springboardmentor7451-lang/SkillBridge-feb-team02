const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(MONGO_URI);
    return conn;
  } catch (e) {
    console.log("Error:", e);
  }
};

module.exports={connectDB};
