const { success, error } = require("../utils/response");
const Listing = require("../models/Listing");

exports.getMe = async (req, res) => {
  return success(res, {
    id: req.user._id,
    email: req.user.email,
    displayName: req.user.displayName,
    avatarUrl: req.user.avatarUrl,
    university: req.user.university,
  });
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No image uploaded", 400);
    }

    req.user.avatarUrl = req.file.path; // Cloudinary URL
    await req.user.save();

    return success(
      res,
      { avatarUrl: req.user.avatarUrl },
      "Avatar updated successfully"
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updatePaymentInfo = async (req, res) => {
  try {
    const { upiId, upiQrUrl } = req.body;

    if (!upiId && !upiQrUrl) {
      return error(res, "Nothing to update", 400);
    }

    if (upiId !== undefined) {
      req.user.paymentInfo.upiId = upiId;
    }

    if (upiQrUrl !== undefined) {
      req.user.paymentInfo.upiQrUrl = upiQrUrl;
    }

    await req.user.save();

    return success(res, req.user.paymentInfo, "Payment info updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

/**
 * PUT /api/users/payment-qr
 */
exports.uploadPaymentQr = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No image uploaded", 400);
    }

    req.user.paymentInfo.upiQrUrl = req.file.path;
    await req.user.save();

    return success(
      res,
      { upiQrUrl: req.user.paymentInfo.upiQrUrl },
      "Payment QR updated"
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};


exports.toggleSavedListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const index = req.user.savedListings.findIndex(
      (id) => id.toString() === listingId
    );

    if (index > -1) {
      req.user.savedListings.splice(index, 1);
    } else {
      req.user.savedListings.push(listingId);
    }

    await req.user.save();

    return success(res, req.user.savedListings);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { messages, studyGroups, marketplace } = req.body;

    if (messages !== undefined) req.user.notificationPreferences.messages = messages;
    if (studyGroups !== undefined) req.user.notificationPreferences.studyGroups = studyGroups;
    if (marketplace !== undefined) req.user.notificationPreferences.marketplace = marketplace;

    await req.user.save();

    return success(res, req.user.notificationPreferences, "Notification preferences updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updatePrivacySettings = async (req, res) => {
  try {
    const { profileVisibility, showOnlineStatus, allowDirectMessages } = req.body;

    if (profileVisibility !== undefined) req.user.privacySettings.profileVisibility = profileVisibility;
    if (showOnlineStatus !== undefined) req.user.privacySettings.showOnlineStatus = showOnlineStatus;
    if (allowDirectMessages !== undefined) req.user.privacySettings.allowDirectMessages = allowDirectMessages;

    await req.user.save();

    return success(res, req.user.privacySettings, "Privacy settings updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getSettings = async (req, res) => {
  try {
    return success(res, {
      notificationPreferences: req.user.notificationPreferences,
      privacySettings: req.user.privacySettings,
      paymentInfo: req.user.paymentInfo
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

/**
 * DELETE /api/users/me
 */
exports.deleteMe = async (req, res, next) => {
  try {
    await Listing.deleteMany({ seller: req.user._id });
    await req.user.deleteOne();

    return success(res, null, "Account deleted");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/saved-listings
 */
exports.getSavedListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      _id: { $in: req.user.savedListings },
      university: req.user.university,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("seller", "displayName avatarUrl");

    return success(res, listings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id/profile
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = req.resource;

    if (!user) {
      return error(res, "User not found", 404);
    }

    const listings = await Listing.find({
      seller: user._id,
      university: req.user.university,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("seller", "displayName avatarUrl");

    return success(res, {
      user: {
        id: user._id,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        university: user.university,
      },
      paymentInfo: user.paymentInfo,
      listings,
      stats: {
        totalListings: listings.length,
      },
    });
  } catch (err) {
    next(err);
  }
};
