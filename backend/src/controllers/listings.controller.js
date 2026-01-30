const Listing = require("../models/Listing");

/**
 * @route   GET /api/listings
 * @desc    Get all active listings (with optional filters)
 * @access  Public
 */
exports.getAllListings = async (req, res) => {
  try {
    const { search, category, condition, seller } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (seller) query.seller = seller;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const listings = await Listing.find(query)
      .populate("seller", "displayName avatarUrl")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route   GET /api/listings/:id
 * @desc    Get single listing
 * @access  Public
 */
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "displayName avatarUrl"
    );

    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(404).json({ message: "Listing not found" });
  }
};

/**
 * @route   POST /api/listings
 * @desc    Create a new listing
 * @access  Private
 */
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      images,
      condition,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      images,
      condition,
      seller: req.user._id,
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @route   PUT /api/listings/:id
 * @desc    Update listing (owner only)
 * @access  Private
 */
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @route   DELETE /api/listings/:id
 * @desc    Soft delete listing (owner only)
 * @access  Private
 */
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    listing.isActive = false;
    await listing.save();

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
