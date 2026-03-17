const express = require("express");
const router = express.Router();

const Application = require("../models/application");
const Opportunity = require("../models/opportunity");

const authorizeRole = require("../middleware/authorizeRole");
const jwtAuth = require("../middleware/jwtAuth");

// Apply to opportunity (Volunteer only)
router.post("/",jwtAuth, authorizeRole("volunteer"), async (req, res) => {
  try {
    // check role
    if (req.user.role !== "volunteer") {
      return res.status(403).json({
        success: false,
        message: "Only volunteers can apply",
      });
    }

    const { opportunity_id } = req.body;
     if (!opportunity_id) {
      return res.status(400).json({
        success: false,
        message: "opportunity_id is required",
      });
    }
    // check opportunity exists
    const opportunity = await Opportunity.findById(opportunity_id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    // check opportunity is open
    if (opportunity.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Opportunity is not open for applications",
      });
    }

    // prevent duplicate applications
    const existingApplication = await Application.findOne({
      opportunity_id,
      volunteer_id: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this opportunity",
      });
    }

    // create application
    const application = await Application.create({
      opportunity_id,
      volunteer_id: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = router;