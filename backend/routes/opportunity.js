const express = require("express");
const router = express.Router();
const Opportunity = require("../models/opportunity");
const authMiddleware = require("../middleware/jwtAuth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/", authMiddleware, authorizeRole("ngo"), async (req, res) => {
  try {
    const { title, description, required_skills, duration, location } =
      req.body;

    if (!title || !description || !required_skills || !duration || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newOpportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title: title.trim(),
      description: description.trim(),
      required_skills,
      duration: duration.trim(),
      location: location.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Opportunity created successfully",
      opportunity: newOpportunity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
});

router.put("/:id", authMiddleware, authorizeRole("ngo"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to edit this opportunity",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "required_skills",
      "duration",
      "location",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    await opportunity.save();

    res.json({
      success: true,
      message: "Opportunity updated successfully",
      opportunity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID",
        });
      }

      const opportunity = await Opportunity.findOne({
        _id: id,
        ngo_id: req.user._id,
      });

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found or not authorized",
        });
      }

      await opportunity.deleteOne();

      res.json({
        success: true,
        message: "Opportunity deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

router.get("/my", authMiddleware, authorizeRole("ngo"), async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      ngo_id: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: opportunities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
