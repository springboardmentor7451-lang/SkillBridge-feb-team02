const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { username, email, password, name, role } = req.body;

  const isUserExists = await UserModel.findOne({ email });

  if (isUserExists) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role == "volunteer") {
    const bio = req.body.bio;
    const volunteerData = {
      username,
      email,
      password: hashedPassword,
      name,
      role,
      bio,
    };
    console.log(volunteerData);

    if (req.body?.location) volunteerData.location = req.body.location;
    if (
      role === "volunteer" &&
      Array.isArray(req.body.skills) &&
      req.body.skills.length > 0
    ) {
      volunteerData.skills = req.body.skills;
    }

    try {
      await UserModel.create(volunteerData);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: e,
      });
    }
  } else {
    const { organization_name, organization_description } = req.body;

    const ngoData = {
      username,
      email,
      password: hashedPassword,
      name,
      role,
      organization_name,
      organization_description,
    };

    if (req.body?.location) ngoData.location = req.body.location;
    if (req.body?.website) ngoData.website = req.body.website;

    try {
      await UserModel.create(ngoData);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    success: true,
    token,
    message: "User created",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User/Email not found",
    });
  }

  const passwordVerify = await bcrypt.compare(password, user.password);

  if (passwordVerify) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      success: true,
      token,
      message: "User logged in",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Incorrect Password",
    });
  }
});

module.exports = router;
