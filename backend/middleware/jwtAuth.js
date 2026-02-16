const UserModel = require("../models/users");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, JWT_SECRET);
      req.user = await UserModel.findOne({ email:decode.email }).select("-password");
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      next();
    }
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Not authorized, token failed",
      error: error,
    });
  }
};

module.exports = authMiddleware;
