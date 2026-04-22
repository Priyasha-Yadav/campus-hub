const StudyGroup = require("../models/StudyGroup");
const { success, error } = require("../utils/response");
const { createNotification } = require("./notifications.controller");

/**
 * GET /api/study-groups
 */
exports.getAllStudyGroups = async (req, res, next) => {
  try {
    const { search, subject, myGroups, page = 1, limit = 12 } = req.query;
    const safeLimit = Math.min(Number(limit), 50);

    const query = {
      isActive: true,
      university: req.user.university,
    };

    if (subject) query.subject = subject;

    if (search) {
      query.$text = { $search: search };
    }

    if (myGroups === "true") {
      query.members = req.user._id;
    }

    const skip = (Number(page) - 1) * safeLimit;

    const [groups, total] = await Promise.all([
      StudyGroup.find(query)
        .populate("creator", "displayName avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      StudyGroup.countDocuments(query),
    ]);

    return success(res, {
      groups,
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
 * GET /api/study-groups/:id
 */
exports.getStudyGroupById = async (req, res, next) => {
  try {
    const groupId = req.resource._id;

    const group = await StudyGroup.findById(groupId)
      .populate("creator", "displayName avatar email")
      .populate("members", "displayName avatar email");

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    return success(res, group);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/study-groups
 */
exports.createStudyGroup = async (req, res, next) => {
  try {
    const {
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      nextSessionAt,
      nextSession,
      links,
      customLinks,
    } = req.body;

    if (!name || !subject) {
      return error(res, "Name and subject are required", 400);
    }

    const normalizedNextSession = {
      ...(nextSession || {}),
    };

    if (nextSessionAt) {
      normalizedNextSession.at = nextSessionAt;
    }

    if (!normalizedNextSession.at) {
      delete normalizedNextSession.at;
    }

    const group = await StudyGroup.create({
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      nextSession:
        Object.keys(normalizedNextSession).length > 0
          ? normalizedNextSession
          : undefined,
      links,
      customLinks,
      creator: req.user._id,
      members: [req.user._id],
      university: req.user.university,
    });

    await createNotification(
      req.user._id,
      "study-group",
      "Study group created",
      `Your group "${group.name}" is live.`,
      group._id,
      "StudyGroup"
    );

    return success(res, group, "Study group created", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/study-groups/:id
 */
exports.updateStudyGroup = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return error(res, "Only the creator can edit this group", 403);
    }

    const {
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      links,
      customLinks,
      nextSession,
    } = req.body;

    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;
    if (subject !== undefined) group.subject = subject;
    if (tags !== undefined) group.tags = tags;
    if (image !== undefined) group.image = image;
    if (maxMembers !== undefined) group.maxMembers = maxMembers;
    if (links !== undefined) group.links = links;
    if (customLinks !== undefined) group.customLinks = customLinks;
    if (nextSession !== undefined) {
      group.nextSession = nextSession;
      group.notifications.sessionReminderSent = false;
    }

    await group.save();

    return success(res, group, "Study group updated");
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/study-groups/:id/next-session
 */
exports.updateNextSession = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return error(res, "Only the creator can update sessions", 403);
    }

    const { at, mode, location, meetingLink } = req.body;

    if (!at) {
      return error(res, "Session time is required", 400);
    }

    group.nextSession = {
      at,
      mode,
      location,
      meetingLink,
    };
    group.notifications.sessionReminderSent = false;
    await group.save();

    return success(res, group, "Next session updated");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/study-groups/:id/cover
 */
exports.uploadGroupCover = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return error(res, "Only the creator can update the cover", 403);
    }

    if (!req.file) {
      return error(res, "No image uploaded", 400);
    }

    group.image = req.file.path;
    await group.save();

    return success(res, group, "Cover image updated");
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/study-groups/:id
 */
exports.deleteStudyGroup = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return error(res, "Only the creator can delete this group", 403);
    }

    group.isActive = false;
    await group.save();

    return success(res, null, "Study group deleted");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/study-groups/upcoming
 */
exports.getUpcomingSessions = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const safeLimit = Math.min(Number(limit), 20);

    const groups = await StudyGroup.find({
      isActive: true,
      university: req.user.university,
      "nextSession.at": { $gte: new Date() },
    })
      .sort({ "nextSession.at": 1 })
      .limit(safeLimit)
      .populate("creator", "displayName avatarUrl");

    return success(res, groups);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/study-groups/:id/join
 */
exports.joinStudyGroup = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return error(res, "Already a member", 400);
    }

    if (group.members.length >= group.maxMembers) {
      return error(res, "Group is full", 400);
    }

    group.members.push(req.user._id);
    await group.save();

    return success(res, null, "Joined study group");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/study-groups/:id/leave
 */
exports.leaveStudyGroup = async (req, res, next) => {
  try {
    const group = req.resource;

    if (!group || !group.isActive) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() === req.user._id.toString()) {
      return error(res, "Creator cannot leave the group", 400);
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return error(res, "Not a member of this group", 400);
    }

    group.members = group.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await group.save();

    return success(res, null, "Left study group");
  } catch (err) {
    next(err);
  }
};
