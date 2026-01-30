const Conversation = require("../models/Conversation");

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations for logged-in user
 * @access  Private
 */
exports.getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "displayName avatarUrl")
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

/**
 * @route   POST /api/conversations
 * @desc    Create or get conversation for listing
 * @access  Private
 */
exports.createConversation = async (req, res, next) => {
  try {
    const { listingId, listingTitle, participantId } = req.body;

    if (!listingId || !participantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const participants = [req.user._id, participantId].map(String).sort();

    let conversation = await Conversation.findOne({
      listingId,
      participants,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        listingId,
        listingTitle,
        participants,
      });
    }

    res.status(201).json(conversation);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};
