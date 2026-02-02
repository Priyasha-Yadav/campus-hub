const mongoose = require("mongoose");

/**
 * Generic university scope middleware
 * Ensures resource belongs to user's university
 *
 * @param {mongoose.Model} Model
 * @param {string} paramKey
 */
const universityScope = (Model, paramKey = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramKey];

      if (!mongoose.Types.ObjectId.isValid(resourceId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if (!resource.university) {
        return res.status(500).json({
          message: "University scoping misconfigured for this resource",
        });
      }

      if (
        resource.university.toString() !==
        req.user.university.toString()
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Attach resource to request to avoid refetching
      req.resource = resource;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = universityScope;
