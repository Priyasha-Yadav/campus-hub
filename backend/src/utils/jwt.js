const jwt = require("jsonwebtoken");

const generateToken = (userId, universityId) => {
  return jwt.sign(
    {
      id: userId,
      university: universityId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { generateToken };