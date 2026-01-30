const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const conversationsController = require("../controllers/conversations.controller");

router.get("/", auth, conversationsController.getUserConversations);
router.post("/", auth, conversationsController.createConversation);

module.exports = router;
