const express = require("express");
const router = express.Router();
const universitiesController = require("../controllers/universities.controller");

// Optional: public, read-only
router.get("/", universitiesController.getUniversities);

module.exports = router;
