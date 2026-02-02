const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxMembers: {
      type: Number,
      default: 10,
      min: 2,
    },

    /**
     * External collaboration links
     */
    links: {
      whatsapp: String,
      telegram: String,
      discord: String,
      googleMeet: String,
    },

    customLinks: [
      {
        label: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],

    /**
     * Next planned session
     */
    nextSession: {
      at: Date,
      mode: {
        type: String,
        enum: ["online", "offline"],
      },
      location: String, // room OR meeting link
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Ensure creator is a member & members are unique
 */
studyGroupSchema.pre("save", function (next) {
  if (this.creator && !this.members.includes(this.creator)) {
    this.members.push(this.creator);
  }

  this.members = [...new Set(this.members.map(String))];
  next();
});

/**
 * Text search support
 */
studyGroupSchema.index({
  name: "text",
  description: "text",
  subject: "text",
  tags: "text",
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
