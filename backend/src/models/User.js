const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },

    /**
     * Saved / Interested listings (wishlist-style)
     */
    savedListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],

    paymentInfo: {
      upiId: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[\w.\-]{2,}@[a-zA-Z]{2,}$/, "Invalid UPI ID"],
      },
      upiQrUrl: {
        type: String,
        trim: true,
      },
    },

    notificationPreferences: {
      messages: {
        type: Boolean,
        default: true,
      },
      studyGroups: {
        type: Boolean,
        default: true,
      },
      marketplace: {
        type: Boolean,
        default: true,
      },
    },

    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ["everyone", "students", "private"],
        default: "everyone",
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
      allowDirectMessages: {
        type: Boolean,
        default: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before save
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare password for login
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
