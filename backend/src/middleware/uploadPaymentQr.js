const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "campus-hub/payment-qr",
    resource_type: "image",
    public_id: `payment_qr_${req.user?._id}_${Date.now()}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "limit",
        quality: "auto",
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
