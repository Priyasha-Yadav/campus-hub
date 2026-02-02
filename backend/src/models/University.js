const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    domains: {
      type: [String],
      required: true,
      unique: true,
    },

    isVerified: {
      type: Boolean,
      default: false, 
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("University", universitySchema);
