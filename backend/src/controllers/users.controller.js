const { success, error } = require("../utils/response");

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
