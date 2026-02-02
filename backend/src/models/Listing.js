const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Textbooks",
        "Electronics",
        "Furniture",
        "Clothing",
        "Sports",
        "Other",
      ],
    },

    images: {
      type: [String],
      default: [],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },
    
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair"],
      default: "good",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Listing", listingSchema);
