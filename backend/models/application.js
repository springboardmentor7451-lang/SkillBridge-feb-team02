const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    cover_letter: {
      type: String,
      default: "",
    },
    applied_at: {
      type: Date,
      default: Date.now,
    },
    reviewed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });

const ApplicationModel = mongoose.model("Application", applicationSchema);

module.exports = ApplicationModel;