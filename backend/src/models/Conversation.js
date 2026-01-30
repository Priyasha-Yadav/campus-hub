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
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Ensure deterministic order for uniqueness
conversationSchema.pre("save", function () {
  if (this.participants?.length) {
    this.participants = this.participants.map(String).sort();
  }
});

// 🔒 Prevent duplicate conversations per listing + participants
conversationSchema.index(
  { listingId: 1, participants: 1 },
  { unique: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
