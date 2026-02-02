const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadAvatar = require("../middleware/uploadAvatar");
const usersController = require("../controllers/users.controller");

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

router.post(
  "/saved-listings/:listingId",
  auth,
  usersController.toggleSavedListing
);

module.exports = router;
