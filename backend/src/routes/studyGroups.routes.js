const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const studyGroupsController = require("../controllers/studyGroups.controller");
const universityScope = require("../middleware/universityScope");
const uploadStudyGroupCover = require("../middleware/uploadStudyGroupCover");
const StudyGroup = require("../models/StudyGroup");

// Public
router.get("/", auth, studyGroupsController.getAllStudyGroups);
router.get("/upcoming", auth, studyGroupsController.getUpcomingSessions);
router.get("/:id", auth, universityScope(StudyGroup), studyGroupsController.getStudyGroupById);

// Protected
router.post("/", auth, studyGroupsController.createStudyGroup);
router.put("/:id", auth, universityScope(StudyGroup), studyGroupsController.updateStudyGroup);
router.put(
  "/:id/next-session",
  auth,
  universityScope(StudyGroup),
  studyGroupsController.updateNextSession
);
router.post(
  "/:id/cover",
  auth,
  universityScope(StudyGroup),
  uploadStudyGroupCover.single("cover"),
  studyGroupsController.uploadGroupCover
);
router.delete("/:id", auth, universityScope(StudyGroup), studyGroupsController.deleteStudyGroup);
router.post("/:id/join", auth, universityScope(StudyGroup), studyGroupsController.joinStudyGroup);
router.post("/:id/leave", auth, universityScope(StudyGroup), studyGroupsController.leaveStudyGroup);

module.exports = router;
