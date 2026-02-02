const Listing = require("../models/Listing");
const { success, error } = require("../utils/response");

/**
 * GET /api/listings
 */
exports.getAllListings = async (req, res, next) => {
  try {
    const { search, category, condition, seller } = req.query;

    const query = {
      isActive: true,
      university: req.user.university,
    };

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

    return success(res, listings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/listings/:id
 */
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      isActive: true,
      university: req.user.university,
    }).populate("seller", "displayName avatarUrl");

    if (!listing) {
      return error(res, "Listing not found", 404);
    }

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
    const { title, description, price, category, images, condition } = req.body;

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
      seller: req.user._id,
      university: req.user.university,
    });

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
    const listing = await Listing.findOne({
      _id: req.params.id,
      seller: req.user._id,
      university: req.user.university,
      isActive: true,
    });

    if (!listing) {
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
    const listing = await Listing.findOne({
      _id: req.params.id,
      seller: req.user._id,
      university: req.user.university,
      isActive: true,
    });

    if (!listing) {
      return error(res, "Listing not found or not authorized", 404);
    }

    listing.isActive = false;
    await listing.save();

    return success(res, null, "Listing deleted");
  } catch (err) {
    next(err);
  }
};
