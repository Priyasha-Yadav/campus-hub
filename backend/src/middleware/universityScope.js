const mongoose = require("mongoose");

/**
 * Generic university scope middleware
 * @param {mongoose.Model} Model - Mongoose model
 * @param {string} paramKey - req.params key containing the ID
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

      if (
        !resource.university ||
        resource.university.toString() !== req.user.university.toString()
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.resource = resource;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = universityScope;
