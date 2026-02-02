const { success, error } = require("../utils/response");

exports.getMe = async (req, res) => {
  return success(res, {
    id: req.user._id,
    email: req.user.email,
    displayName: req.user.displayName,
    avatarUrl: req.user.avatarUrl,
    university: req.user.university,
  });
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No image uploaded", 400);
    }

    req.user.avatarUrl = req.file.path;
    await req.user.save();

    return success(res, {
      avatarUrl: req.user.avatarUrl,
    }, "Avatar updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
