const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const usersController = require("../controllers/users.controller");

router.get("/me", auth, usersController.getMe);

router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  usersController.uploadAvatar
);

module.exports = router;
