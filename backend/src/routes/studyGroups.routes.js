const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const studyGroupsController = require("../controllers/studyGroups.controller");

// Public
router.get("/", studyGroupsController.getAllStudyGroups);
router.get("/:id", studyGroupsController.getStudyGroupById);

// Protected
router.post("/", auth, studyGroupsController.createStudyGroup);
router.post("/:id/join", auth, studyGroupsController.joinStudyGroup);
router.post("/:id/leave", auth, studyGroupsController.leaveStudyGroup);

module.exports = router;
