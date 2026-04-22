const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/summary", auth, dashboardController.getDashboardSummary);

module.exports = router;
