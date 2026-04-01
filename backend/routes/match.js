const express = require("express");
const router = express.Router();
const Opportunity = require("../models/opportunity");
const UserModel = require("../models/users");
const jwtAuth = require("../middleware/jwtAuth");
const authorizeRole = require("../middleware/authorizeRole");

// GET /api/match/opportunities - For Volunteers
router.get("/opportunities", jwtAuth, authorizeRole("volunteer"), async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    const userLocation = req.user.location;

    const opportunities = await Opportunity.find({ status: "open" })
      .populate("ngo_id", "name organization_name location");

    const matchedOpportunities = opportunities.map(opp => {
      const requiredSkills = opp.required_skills || [];
      if (requiredSkills.length === 0) return { ...opp.toObject(), matchScore: 0 };

      const matchingSkills = requiredSkills.filter(skill => 
        userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
      );

      let score = (matchingSkills.length / requiredSkills.length) * 100;

      // Location boost (simple string match)
      if (userLocation && opp.location && userLocation.toLowerCase() === opp.location.toLowerCase()) {
        score += 10;
      }

      return {
        ...opp.toObject(),
        matchScore: Math.round(score),
        matchingSkillsCount: matchingSkills.length,
      };
    });

    // Filter out zero matches or low matches if needed, then sort
    const sortedOpportunities = matchedOpportunities
      .filter(opp => opp.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: sortedOpportunities,
    });
  } catch (error) {
    console.error("Error matching opportunities:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/match/volunteers/:opportunityId - For NGOs
router.get("/volunteers/:opportunityId", jwtAuth, authorizeRole("ngo"), async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }

    const requiredSkills = opportunity.required_skills || [];
    const oppLocation = opportunity.location;

    const volunteers = await UserModel.find({ role: "volunteer" });

    const matchedVolunteers = volunteers.map(volunteer => {
      const userSkills = volunteer.skills || [];
      if (requiredSkills.length === 0) return { ...volunteer.toObject(), matchScore: 0 };

      const matchingSkills = requiredSkills.filter(skill => 
        userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
      );

      let score = (matchingSkills.length / requiredSkills.length) * 100;

      // Location boost
      if (oppLocation && volunteer.location && oppLocation.toLowerCase() === volunteer.location.toLowerCase()) {
        score += 10;
      }

      return {
        ...volunteer.toObject(),
        matchScore: Math.round(score),
        matchingSkillsCount: matchingSkills.length,
      };
    });

    const sortedVolunteers = matchedVolunteers
      .filter(v => v.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: sortedVolunteers,
    });
  } catch (error) {
    console.error("Error matching volunteers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
