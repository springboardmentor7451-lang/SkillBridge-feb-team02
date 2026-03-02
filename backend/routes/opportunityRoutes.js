const express = require("express");
const router = express.Router();
const Opportunity = require("../models/opportunity");
const authMiddleware = require("../middleware/jwtAuth");
const authorizeRole = require("../middleware/authorizeRole");


// 🔹 CREATE OPPORTUNITY (NGO only)
router.post(
  "/",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const { title, description, required_skills, duration, location } =
        req.body;

      const newOpportunity = await Opportunity.create({
        ngo_id: req.user._id,
        title,
        description,
        required_skills,
        duration,
        location,
      });

      res.status(201).json({
        success: true,
        message: "Opportunity created successfully",
        opportunity: newOpportunity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
);


// 🔹 EDIT OPPORTUNITY (NGO only)
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found",
        });
      }

      // ensure NGO owns it
      if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to edit this opportunity",
        });
      }

      Object.assign(opportunity, req.body);

      await opportunity.save();

      res.json({
        success: true,
        message: "Opportunity updated successfully",
        opportunity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
);


// 🔹 DELETE OPPORTUNITY (NGO only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found",
        });
      }

      if (opportunity.ngo_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to delete this opportunity",
        });
      }

      await opportunity.deleteOne();

      res.json({
        success: true,
        message: "Opportunity deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
);

module.exports = router;