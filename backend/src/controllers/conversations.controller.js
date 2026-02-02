const Conversation = require("../models/Conversation");
const Listing = require("../models/Listing");
const User = require("../models/User");
const { success, error } = require("../utils/response");

/**
 * GET /api/conversations
 */
exports.getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      university: req.user.university,
    })
      .populate("participants", "displayName avatarUrl")
      .sort({ lastMessageAt: -1 });

    return success(res, conversations);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/conversations
 */
exports.createConversation = async (req, res, next) => {
  try {
    const { listingId, participantId } = req.body;

    if (!listingId || !participantId) {
      return error(res, "Missing required fields", 400);
    }

    if (participantId === req.user._id.toString()) {
      return error(res, "Cannot start conversation with yourself", 400);
    }

    // 🔍 Load listing
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return error(res, "Listing not found", 404);
    }

    // 🔒 University check
    if (listing.university.toString() !== req.user.university.toString()) {
      return error(res, "Access denied", 403);
    }

    // 🔍 Load other user
    const otherUser = await User.findById(participantId);
    if (!otherUser) {
      return error(res, "User not found", 404);
    }

    if (
      otherUser.university.toString() !== req.user.university.toString()
    ) {
      return error(res, "Cross-university conversation not allowed", 403);
    }

    const participants = [req.user._id, otherUser._id]
      .map(String)
      .sort();

    let conversation = await Conversation.findOne({
      listingId,
      participants,
      university: req.user.university,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        listingId,
        listingTitle: listing.title, // 🔒 derived, not trusted
        participants,
        university: req.user.university,
      });
    }

    return success(res, conversation, "Conversation ready", 201);
  } catch (err) {
    next(err);
  }
};
