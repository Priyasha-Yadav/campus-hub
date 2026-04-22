const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadAvatar = require("../middleware/uploadAvatar");
const usersController = require("../controllers/users.controller");
const universityScope = require("../middleware/universityScope");
const User = require("../models/User");
const uploadPaymentQr = require("../middleware/uploadPaymentQr");

router.get("/me", auth, usersController.getMe);

router.put(
  "/avatar",
  auth,
  uploadAvatar.single("avatar"),
  usersController.uploadAvatar
);

router.put(
  "/payment-info",
  auth,
  usersController.updatePaymentInfo
);

router.put(
  "/payment-qr",
  auth,
  uploadPaymentQr.single("qr"),
  usersController.uploadPaymentQr
);

router.post(
  "/saved-listings/:listingId",
  auth,
  usersController.toggleSavedListing
);

router.get("/settings", auth, usersController.getSettings);
router.get("/me/saved-listings", auth, usersController.getSavedListings);
router.delete("/me", auth, usersController.deleteMe);

router.get(
  "/:id/profile",
  auth,
  universityScope(User),
  usersController.getUserProfile
);

router.put(
  "/notification-preferences",
  auth,
  usersController.updateNotificationPreferences
);

router.put(
  "/privacy-settings",
  auth,
  usersController.updatePrivacySettings
);

module.exports = router;
