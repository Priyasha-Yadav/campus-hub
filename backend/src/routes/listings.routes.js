const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listingsController = require("../controllers/listings.controller");
const universityScope = require("../middleware/universityScope");
const uploadListingImages = require("../middleware/uploadListingImages");
const Listing = require("../models/Listing");

// Public
router.get("/", auth, listingsController.getAllListings);
router.get("/me", auth, listingsController.getMyListings);
router.get("/:id", auth, universityScope(Listing), listingsController.getListingById);


// Protected
router.post("/", auth, listingsController.createListing);
router.post(
  "/:id/images",
  auth,
  universityScope(Listing),
  uploadListingImages.array("images", 6),
  listingsController.uploadListingImages
);
router.patch(
  "/:id/status",
  auth,
  universityScope(Listing),
  listingsController.updateListingStatus
);
router.put("/:id", auth, universityScope(Listing), listingsController.updateListing);
router.delete("/:id", auth, universityScope(Listing), listingsController.deleteListing);

module.exports = router;
