const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/response");

const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer ")) {
      return error(res, "Unauthorized", 401);
    }

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "_id email displayName avatarUrl university savedListings"
    );

    if (!user) {
      return error(res, "Unauthorized", 401);
    }

    if (
      decoded.university &&
      user.university.toString() !== decoded.university.toString()
    ) {
      return error(res, "Unauthorized", 401);
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return error(res, "Unauthorized", 401);
  }
};

module.exports = auth;
