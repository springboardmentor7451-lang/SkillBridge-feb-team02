const UserModel = require("../models/users");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, JWT_SECRET);
      req.user = await UserModel.findOne({ email: decode.email }).select("-password");
    }
    next();
  } catch (error) {
    // If token is invalid or missing, we just proceed without req.user
    next();
  }
};

module.exports = optionalAuth;
