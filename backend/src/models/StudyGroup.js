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
      whatsapp: { type: String, trim: true },
      telegram: { type: String, trim: true },
      discord: { type: String, trim: true },
      googleMeet: { type: String, trim: true },
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
      location: String,
      meetingLink: String
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

    notifications: {
      sessionReminderSent: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Ensure creator is a member & members are unique
 */
studyGroupSchema.pre("save", function () {
  if (this.creator) {
    const creatorId = this.creator.toString();

    const memberIds = this.members.map((m) => m.toString());

    if (!memberIds.includes(creatorId)) {
      this.members.push(this.creator);
    }

    this.members = [...new Set(memberIds.concat(creatorId))];
  }
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

studyGroupSchema.index({ university: 1, isActive: 1 });
studyGroupSchema.index({ university: 1, isActive: 1, "nextSession.at": 1 });

studyGroupSchema.virtual("memberCount").get(function () {
  return this.members?.length || 0;
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
