const University = require("../models/University");
const { success } = require("../utils/response");

/**
 * GET /api/universities
 * (optional, read-only)
 */
exports.getUniversities = async (req, res, next) => {
  try {
    const universities = await University.find({})
      .select("name domains logoUrl country")
      .sort({ name: 1 });

    return success(res, universities);
  } catch (err) {
    next(err);
  }
};

/**
 * INTERNAL: resolve university from email domain
 */
exports.resolveUniversityByEmail = async (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    throw new Error("Invalid email");
  }

  let university = await University.findOne({
    domains: domain,
  });

  if (!university) {
    university = await University.create({
      name: domain.split(".")[0].toUpperCase(),
      domains: [domain],
    });
  }

  return university;
};
