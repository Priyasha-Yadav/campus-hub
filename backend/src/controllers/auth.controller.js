const User = require("../models/User");
const crypto = require("crypto");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const { resolveUniversityByEmail } = require("./universities.controller");

/**
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return error(res, "All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, "Email already in use", 400);
    }

    const university = await resolveUniversityByEmail(email);

    const user = await User.create({
      email,
      password,
      displayName,
      university: university._id,
    });

    const token = generateToken(user._id, university._id);

    return success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          university: university,
        },
        token,
      },
      "Signup successful",
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password required", 400);
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("university", "name logoUrl");

    if (!user) {
      return error(res, "Invalid credentials", 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, "Invalid credentials", 400);
    }

    const token = generateToken(user._id, user.university._id);

    return success(res, {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        university: user.university,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return error(res, "Email is required", 400);
    }

    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpires"
    );

    if (!user) {
      return success(res, null, "If the email exists, a reset link was sent");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const payload =
      process.env.NODE_ENV !== "production"
        ? { resetToken }
        : null;

    return success(res, payload, "Password reset link sent");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return error(res, "Token and password are required", 400);
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      return error(res, "Invalid or expired token", 400);
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return success(res, null, "Password reset successful");
  } catch (err) {
    next(err);
  }
};
