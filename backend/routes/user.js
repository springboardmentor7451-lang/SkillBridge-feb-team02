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
    const { email, role } = req.user;

    const updateFields = {};

    if (role === "volunteer") {
      const { name, location, bio, skills } = req.body;

      if (name) updateFields.name = name;
      if (location) updateFields.location = location;
      if (bio) updateFields.bio = bio;
      if (skills) updateFields.skills = skills;
    } else if (role === "ngo") {
      const { organization_name, description, website } = req.body;

      if (organization_name) updateFields.organization_name = organization_name;
      if (description) updateFields.description = description;
      if (website) updateFields.website = website;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

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
