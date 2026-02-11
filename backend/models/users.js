const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["volunteer", "ngo"], required: true },
    skills: { type: [String], default: undefined },
    location: { type: String },
    bio: {
      type: String,
      required: function () {
        return this.role === "volunteer";
      },
    },

    organization_name: {
      type: String,
      required: function () {
        return this.role === "ngo";
      },
    },

    organization_description: {
      type: String,
      required: function () {
        return this.role === "ngo";
      },
    },
    website: { type: String },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
