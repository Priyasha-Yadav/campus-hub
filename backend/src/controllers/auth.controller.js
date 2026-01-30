const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */

exports.signup = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("Email already in use");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.create({ email, password, displayName });
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
      token,
    });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};


/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};
