const Listing = require("../models/Listing");
const StudyGroup = require("../models/StudyGroup");
const { success, error } = require("../utils/response");

/**
 * GET /api/dashboard/summary
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const [activeListings, activeGroups] = await Promise.all([
      Listing.countDocuments({
        university: req.user.university,
        isActive: true,
        status: "available",
      }),
      StudyGroup.countDocuments({
        university: req.user.university,
        isActive: true,
      }),
    ]);

    const locations =
      Number(process.env.CAMPUS_LOCATIONS_COUNT) || 85;

    return success(res, {
      activeListings,
      activeGroups,
      locations,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
