const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const studyGroupsController = require("../controllers/studyGroups.controller");
const universityScope = require("../middleware/universityScope");
const StudyGroup = require("../models/StudyGroup");

// Public
router.get("/", auth, studyGroupsController.getAllStudyGroups);
router.get("/:id", auth, universityScope(StudyGroup), studyGroupsController.getStudyGroupById);

// Protected
router.post("/", auth, studyGroupsController.createStudyGroup);
router.post("/:id/join", auth, universityScope(StudyGroup), studyGroupsController.joinStudyGroup);
router.post("/:id/leave", auth, universityScope(StudyGroup), studyGroupsController.leaveStudyGroup);

module.exports = router;
