const express = require("express");
const UserModel = require("../models/users");
const router = express.Router();

router.get("/me", (req, res) => {
  const userData = req.user;
  res.json({
    success: true,
    userData,
  });
});

router.put("/me", async (req, res) => {
  try {
    const { _id, role } = req.user;
    const updateFields = {};
    const { name, location, bio } = req.body;
    if (name !== undefined) updateFields.name = name;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;

    if (role === "volunteer") {
      const { skills } = req.body;
      if (skills !== undefined) {
        if (!Array.isArray(skills)) {
          return res.status(400).json({ success: false, message: "Skills must be an array" });
        }
        updateFields.skills = skills;
      }
    } else if (role === "ngo") {
      const { organization_name, description, website } = req.body;

      if (organization_name !== undefined) updateFields.organization_name = organization_name;

      if (description !== undefined) {
        updateFields.organization_description = description;
      }

      if (website !== undefined) {
        if (website !== "" && !website.startsWith("http")) {
          return res.status(400).json({ success: false, message: "Invalid website URL" });
        }
        updateFields.website = website;
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e,
    });
  }
});

module.exports = router;
