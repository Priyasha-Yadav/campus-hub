const Listing = require("../models/Listing");
const { success, error } = require("../utils/response");
const { createNotification } = require("./notifications.controller");

/**
 * GET /api/listings
 */
exports.getAllListings = async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      seller,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = "newest",
      status,
    } = req.query;

    const safeLimit = Math.min(Number(limit), 50);
    const query = {
      isActive: true,
      university: req.user.university,
    };

    if (status && status !== "all") {
      query.status = status;
    } else if (!status) {
      query.status = "available";
    }

    if (category && category !== "All") query.category = category;
    if (condition) query.condition = condition;
    if (seller) query.seller = seller;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("seller", "displayName avatarUrl")
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(safeLimit),
      Listing.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: listings,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/listings/:id
 */
exports.getListingById = async (req, res, next) => {
  try {
    const listing = req.resource;

    if (!listing || !listing.isActive) {
      return error(res, "Listing not found", 404);
    }

    await listing.populate("seller", "displayName avatarUrl");

    return success(res, listing);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/listings
 */
exports.createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      images,
      condition,
      status,
    } = req.body;

    if (!title || !price || !category) {
      return error(res, "Missing required fields", 400);
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      images,
      condition,
      status,
      seller: req.user._id,
      university: req.user.university,
    });

    // Create notification for the user
    await createNotification(
      req.user._id,
      "marketplace",
      "Listing Created",
      `Your listing "${title}" has been posted successfully`,
      listing._id,
      "Listing"
    );

    return success(res, listing, "Listing created", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/listings/:id
 */
exports.updateListing = async (req, res, next) => {
  try {
    const listing = req.resource;

    if (!listing || !listing.isActive) {
      return error(res, "Listing not found or not authorized", 404);
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return error(res, "Listing not found or not authorized", 404);
    }

    Object.assign(listing, req.body);
    await listing.save();

    return success(res, listing);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/listings/:id
 */
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = req.resource;

    if (!listing || !listing.isActive) {
      return error(res, "Listing not found or not authorized", 404);
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return error(res, "Listing not found or not authorized", 404);
    }

    listing.isActive = false;
    await listing.save();

    return success(res, null, "Listing deleted");
  } catch (err) {
    next(err);
  }
};

exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      seller: req.user._id,
      isActive: true,
      university: req.user.university,
    }).sort({ createdAt: -1 });

    return success(res, listings);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/listings/:id/status
 */
exports.updateListingStatus = async (req, res, next) => {
  try {
    const listing = req.resource;

    if (!listing || !listing.isActive) {
      return error(res, "Listing not found or not authorized", 404);
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return error(res, "Listing not found or not authorized", 404);
    }

    const { status } = req.body;
    const allowed = ["available", "sold", "reserved"];

    if (!allowed.includes(status)) {
      return error(res, "Invalid status", 400);
    }

    listing.status = status;
    await listing.save();

    return success(res, listing, "Listing status updated");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/listings/:id/images
 */
exports.uploadListingImages = async (req, res, next) => {
  try {
    const listing = req.resource;

    if (!listing || !listing.isActive) {
      return error(res, "Listing not found or not authorized", 404);
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return error(res, "Listing not found or not authorized", 404);
    }

    if (!req.files || req.files.length === 0) {
      return error(res, "No images uploaded", 400);
    }

    const urls = req.files.map((file) => file.path);
    listing.images = [...listing.images, ...urls];
    await listing.save();

    return success(res, listing, "Images uploaded");
  } catch (err) {
    next(err);
  }
};
