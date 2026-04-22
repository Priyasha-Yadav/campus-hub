const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const notificationsController = require("../controllers/notifications.controller");

router.get("/", auth, notificationsController.getNotifications);
router.put("/:id/read", auth, notificationsController.markAsRead);
router.put("/read-all", auth, notificationsController.markAllAsRead);
router.delete("/:id", auth, notificationsController.deleteNotification);

module.exports = router;