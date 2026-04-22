const Notification = require("../models/Notification");
const { success, error } = require("../utils/response");

exports.getNotifications = async (req, res) => {
  try {
    const { type, read, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.user._id };
    if (type && type !== 'all') query.type = type;
    if (read !== undefined) query.read = read === 'true';
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: req.user._id, read: false })
    ]);
    
    return success(res, {
      notifications,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
        unreadCount
      }
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return error(res, "Notification not found", 404);
    }
    
    return success(res, notification, "Notification marked as read");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    return success(res, null, "All notifications marked as read");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id
    });
    
    if (!notification) {
      return error(res, "Notification not found", 404);
    }
    
    return success(res, null, "Notification deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.createNotification = async (userId, type, title, description, relatedId = null, relatedModel = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      description,
      relatedId,
      relatedModel
    });
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    return null;
  }
};