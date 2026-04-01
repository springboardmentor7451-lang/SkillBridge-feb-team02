const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    required_skills: {
      type: [String],
      default: [],
    },

    duration: {
      type: String,
    },

    location: {
      type: String,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

opportunitySchema.index({ status: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ required_skills: 1 });

const OpportunityModel = mongoose.model("Opportunity", opportunitySchema);

module.exports = OpportunityModel;
