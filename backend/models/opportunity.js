const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // references your User model
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
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);