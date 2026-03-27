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
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ApplicationModel = mongoose.model("Application", applicationSchema);

module.exports = ApplicationModel;