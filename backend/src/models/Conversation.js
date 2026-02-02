const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    listingTitle: {
      type: String,
      required: true,
      trim: true,
    },

    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: (arr) => arr.length === 2,
        message: "Conversation must have exactly 2 participants",
      },
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },

    lastMessage: {
      type: String,
      trim: true,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

conversationSchema.pre("save", function () {
  if (this.participants?.length) {
    this.participants = this.participants.map(String).sort();
  }
});


conversationSchema.index(
  { listingId: 1, participants: 1 },
  { unique: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);