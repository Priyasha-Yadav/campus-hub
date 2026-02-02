const StudyGroup = require("../models/StudyGroup");
const { success, error } = require("../utils/response");

/**
 * GET /api/study-groups
 */
exports.getAllStudyGroups = async (req, res, next) => {
  try {
    const { search, subject, myGroups } = req.query;

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

    const groups = await StudyGroup.find(query)
      .populate("creator", "displayName avatarUrl")
      .sort({ createdAt: -1 });

    return success(res, groups);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/study-groups/:id
 */
exports.getStudyGroupById = async (req, res, next) => {
  try {
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      university: req.user.university,
      isActive: true,
    })
      .populate("creator", "displayName avatarUrl")
      .populate("members", "displayName avatarUrl");

    if (!group) {
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
      links,
      platform,
    } = req.body;

    if (!name || !subject) {
      return error(res, "Name and subject are required", 400);
    }

    const group = await StudyGroup.create({
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      nextSessionAt,
      links,
      platform,
      creator: req.user._id,
      members: [req.user._id],
      university: req.user.university,
    });

    return success(res, group, "Study group created", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/study-groups/:id/join
 */
exports.joinStudyGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      university: req.user.university,
      isActive: true,
    });

    if (!group) {
      return error(res, "Study group not found", 404);
    }

    if (group.members.includes(req.user._id)) {
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
    const group = await StudyGroup.findOne({
      _id: req.params.id,
      university: req.user.university,
      isActive: true,
    });

    if (!group) {
      return error(res, "Study group not found", 404);
    }

    if (group.creator.toString() === req.user._id.toString()) {
      return error(res, "Creator cannot leave the group", 400);
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
