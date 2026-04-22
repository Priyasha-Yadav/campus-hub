const Message = require("../models/Message");
const { success, error } = require("../utils/response");

/**
 * GET /api/messages/:conversationId
 */
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 30 } = req.query;
    const safeLimit = Math.min(Number(limit), 100);

    const conversation = req.resource;

    if (!conversation) {
      return error(res, "Conversation not found", 404);
    }

    const isParticipant = conversation.participants
      .map(String)
      .includes(req.user._id.toString());

    if (!isParticipant) {
      return error(res, "Not authorized", 403);
    }

    const skip = (Number(page) - 1) * safeLimit;

    const [messages, total] = await Promise.all([
      Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Message.countDocuments({ conversation: conversationId }),
    ]);

    return success(res, {
      messages: messages.reverse(),
      meta: {
        page: Number(page),
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/messages/:conversationId/read
 */
exports.markConversationRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = req.resource;

    if (!conversation) {
      return error(res, "Conversation not found", 404);
    }

    const isParticipant = conversation.participants
      .map(String)
      .includes(req.user._id.toString());

    if (!isParticipant) {
      return error(res, "Not authorized", 403);
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        readAt: null,
      },
      { readAt: new Date() }
    );

    return success(res, null, "Messages marked as read");
  } catch (err) {
    next(err);
  }
};
