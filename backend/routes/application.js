const express = require("express");
<<<<<<< issue-33-opportunity-details
const mongoose = require("mongoose");
const router = express.Router();
const Application = require("../models/application");
const Opportunity = require("../models/opportunity");
const authMiddleware = require("../middleware/jwtAuth");
const authorizeRole = require("../middleware/authorizeRole");

router.get(
  "/opportunity/:opportunityId",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const { opportunityId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID",
        });
      }

      const opportunity = await Opportunity.findOne({
        _id: opportunityId,
        ngo_id: req.user._id,
      });

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found or not authorized",
        });
      }

      const applications = await Application.find({
        opportunity_id: opportunityId,
      })
        .populate("volunteer_id", "name email skills bio location")
        .sort({ applied_at: -1 });

      res.json({
        success: true,
        data: applications,
        opportunity: {
          _id: opportunity._id,
          title: opportunity.title,
          location: opportunity.location,
          required_skills: opportunity.required_skills,
        },
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.get(
  "/ngo/applications",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const opportunities = await Opportunity.find({
        ngo_id: req.user._id,
      }).select("_id title");

      const opportunityIds = opportunities.map((opp) => opp._id);
      const applications = await Application.find({
        opportunity_id: { $in: opportunityIds },
      })
        .populate("volunteer_id", "name email skills bio location")
        .populate("opportunity_id", "title location required_skills")
        .sort({ applied_at: -1 });

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.put(
  "/:applicationId/status",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be pending, accepted, or rejected",
        });
      }

      const application = await Application.findById(applicationId)
        .populate("opportunity_id", "ngo_id title");

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      if (application.opportunity_id.ngo_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this application",
        });
      }

      const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { status, reviewed_at: new Date() },
        { new: true }
      )
        .populate("volunteer_id", "name email skills bio location")
        .populate("opportunity_id", "title location required_skills");

      res.json({
        success: true,
        message: `Application ${status} successfully`,
        data: updatedApplication,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.post(
  "/apply",
  authMiddleware,
  authorizeRole("volunteer"),
  async (req, res) => {
    try {
      const { opportunityId, coverLetter } = req.body;

      if (!opportunityId) {
        return res.status(400).json({
          success: false,
          message: "Opportunity ID is required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID",
        });
      }

      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found",
        });
      }

      const existingApplication = await Application.findOne({
        opportunity_id: opportunityId,
        volunteer_id: req.user._id,
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this opportunity",
        });
      }

      const application = await Application.create({
        opportunity_id: opportunityId,
        volunteer_id: req.user._id,
        ngo_id: opportunity.ngo_id,
        cover_letter: coverLetter || "",
        status: "pending",
      });

      const populatedApplication = await Application.findById(application._id)
        .populate("volunteer_id", "name email skills")
        .populate("opportunity_id", "title");

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: populatedApplication,
      });
    } catch (error) {
      console.error("Error applying for opportunity:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.get(
  "/my",
  authMiddleware,
  authorizeRole("volunteer"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        volunteer_id: req.user._id,
      })
        .populate("opportunity_id", "title location required_skills status")
        .populate("ngo_id", "name organization_name")
        .sort({ applied_at: -1 });

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error("Error fetching my applications:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.get(
  "/volunteer/applications",
  authMiddleware,
  authorizeRole("volunteer"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        volunteer_id: req.user._id,
      })
        .populate("opportunity_id", "title location required_skills status")
        .populate("ngo_id", "name organization_name")
        .sort({ applied_at: -1 });

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error("Error fetching my applications:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);
=======
const router = express.Router();

const Application = require("../models/application");
const Opportunity = require("../models/opportunity");

const authorizeRole = require("../middleware/authorizeRole");

router.post("/", authorizeRole("volunteer"), async (req, res) => {
  try {
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
    console.error("Apply to Opportunity Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
>>>>>>> master

module.exports = router;