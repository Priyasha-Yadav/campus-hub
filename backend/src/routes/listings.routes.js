const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listingsController = require("../controllers/listings.controller");
const universityScope = require("../middleware/universityScope");
const Listing = require("../models/Listing");

// Public
router.get("/", auth, listingsController.getAllListings);
router.get("/:id", auth, universityScope(Listing), listingsController.getListingById);
router.get("/me", auth, listingsController.getMyListings);


// Protected
router.post("/", auth, listingsController.createListing);
router.put("/:id", auth, universityScope(Listing), listingsController.updateListing);
router.delete("/:id", auth, universityScope(Listing), listingsController.deleteListing);

module.exports = router;
