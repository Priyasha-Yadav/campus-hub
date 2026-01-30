const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listingsController = require("../controllers/listings.controller");

// Public
router.get("/", listingsController.getAllListings);
router.get("/:id", listingsController.getListingById);

// Protected
router.post("/", auth, listingsController.createListing);
router.put("/:id", auth, listingsController.updateListing);
router.delete("/:id", auth, listingsController.deleteListing);

module.exports = router;
