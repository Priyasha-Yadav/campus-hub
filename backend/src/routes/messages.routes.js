const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messagesController = require("../controllers/messages.controller");

router.get("/:conversationId", auth, messagesController.getMessages);

module.exports = router;
