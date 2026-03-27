const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Opportunity = require("../models/opportunity");
const Application = require("../models/application");
const authMiddleware = require("../middleware/jwtAuth");
const authorizeRole = require("../middleware/authorizeRole");

router.get("/", async (req, res) => {
  try {
    const { skill, location, search, limit } = req.query;
    const query = { status: 'open' };
    if (skill) {
      query.required_skills = { 
        $in: [new RegExp(skill, 'i')] 
      };
    }
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    let opportunitiesQuery = Opportunity.find(query)
      .populate('ngo_id', 'name email organization_name') 
      .sort({ createdAt: -1 });
    if (limit) {
      opportunitiesQuery = opportunitiesQuery.limit(parseInt(limit));
    }
    
    const opportunities = await opportunitiesQuery;
    
    res.json({
      success: true,
      data: opportunities,
      count: opportunities.length
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

router.get("/filters/options", async (req, res) => {
  try {

    const opportunities = await Opportunity.find({ status: 'open' });

    const skillsSet = new Set();
    opportunities.forEach(opp => {
      (opp.required_skills || []).forEach(skill => {
        skillsSet.add(skill);
      });
    });

    const locationsSet = new Set();
    opportunities.forEach(opp => {
      if (opp.location) {
        locationsSet.add(opp.location);
      }
    });

    const skills = Array.from(skillsSet).sort();
    const locations = Array.from(locationsSet).sort();
    
    res.json({
      success: true,
      data: {
        skills,
        locations
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

router.get("/my", authMiddleware, authorizeRole("ngo"), async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      ngo_id: req.user._id,
    }).sort({ createdAt: -1 }).lean();

    // Add applicants count for each opportunity
    const opportunitiesWithCount = await Promise.all(
      opportunities.map(async (opp) => {
        const applicantsCount = await Application.countDocuments({
          opportunity_id: opp._id,
        });
        return { ...opp, applicantsCount };
      })
    );

    res.json({
      success: true,
      data: opportunitiesWithCount,
    });
  } catch (error) {
    console.error("Error fetching my opportunities:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID",
      });
    }

    const opportunity = await Opportunity.findById(id)
      .populate('ngo_id', 'name email organization_name organization_description location');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

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
      status: 'open', 
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

router.put("/:id", authorizeRole("ngo"), async (req, res) => {
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

router.delete("/:id", authorizeRole("ngo"), async (req, res) => {
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

module.exports = router;
