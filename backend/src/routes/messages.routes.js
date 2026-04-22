const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messagesController = require("../controllers/messages.controller");
const universityScope = require("../middleware/universityScope");
const Conversation = require("../models/Conversation");

router.get("/:conversationId", auth, universityScope(Conversation, "conversationId"), messagesController.getMessages);
router.put("/:conversationId/read", auth, universityScope(Conversation, "conversationId"), messagesController.markConversationRead);

module.exports = router;
