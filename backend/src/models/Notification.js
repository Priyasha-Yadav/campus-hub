const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    type: {
      type: String,
      required: true,
      enum: ["message", "study-group", "marketplace", "system"],
    },
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    read: {
      type: Boolean,
      default: false,
    },
    
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    
    relatedModel: {
      type: String,
      enum: ["Listing", "StudyGroup", "Message", "User"],
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);