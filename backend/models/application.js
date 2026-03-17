const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "opportunity",
      required: true,
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
applicationSchema.index(
  { opportunity_id: 1, volunteer_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("application", applicationSchema);