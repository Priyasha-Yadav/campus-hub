const StudyGroup = require("../models/StudyGroup");

/**
 * @route   GET /api/study-groups
 * @desc    Get all study groups (with filters)
 * @access  Public
 */
exports.getAllStudyGroups = async (req, res) => {
  try {
    const { search, subject, myGroups } = req.query;

    const query = { isActive: true };

    if (subject) {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (myGroups === "true" && req.user) {
      query.members = req.user._id;
    }

    const groups = await StudyGroup.find(query)
      .populate("creator", "displayName avatarUrl")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route   GET /api/study-groups/:id
 * @desc    Get single study group
 * @access  Public
 */
exports.getStudyGroupById = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate("creator", "displayName avatarUrl")
      .populate("members", "displayName avatarUrl");

    if (!group || !group.isActive) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.json(group);
  } catch (err) {
    res.status(404).json({ message: "Study group not found" });
  }
};

/**
 * @route   POST /api/study-groups
 * @desc    Create study group
 * @access  Private
 */
exports.createStudyGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      nextSessionAt,
    } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ message: "Name and subject are required" });
    }

    const studyGroup = await StudyGroup.create({
      name,
      description,
      subject,
      tags,
      image,
      maxMembers,
      nextSessionAt,
      creator: req.user._id,
      members: [req.user._id], // 👈 auto-add creator
    });

    res.status(201).json(studyGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @route   POST /api/study-groups/:id/join
 * @desc    Join study group
 * @access  Private
 */
exports.joinStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group || !group.isActive) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: "Joined study group successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @route   POST /api/study-groups/:id/leave
 * @desc    Leave study group
 * @access  Private
 */
exports.leaveStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group || !group.isActive) {
      return res.status(404).json({ message: "Study group not found" });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await group.save();

    res.json({ message: "Left study group successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
