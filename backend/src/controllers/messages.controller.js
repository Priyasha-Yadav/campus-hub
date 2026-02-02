const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { success, error } = require("../utils/response");

/**
 * GET /api/messages/:conversationId
 */
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      university: req.user.university,
    });

    if (!conversation) {
      return error(res, "Conversation not found", 404);
    }

    const isParticipant = conversation.participants
      .map(String)
      .includes(req.user._id.toString());

    if (!isParticipant) {
      return error(res, "Not authorized", 403);
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    return success(res, messages);
  } catch (err) {
    next(err);
  }
};
