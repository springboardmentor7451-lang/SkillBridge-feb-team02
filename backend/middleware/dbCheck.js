const { connectDB } = require("../config/db");

const dbCheck = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection check failed", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

module.exports = dbCheck;
