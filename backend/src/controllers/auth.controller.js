const User = require("../models/User");
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
