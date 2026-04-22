const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "campus-hub/avatars",
    resource_type: "image",
    public_id: `user_${Date.now()}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 256,
        height: 256,
        crop: "fill",
        gravity: "face",
      },
    ],
  }),
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
