const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const universitiesRoutes = require("./routes/universities.routes");
const listingsRoutes = require("./routes/listings.routes");
const conversationsRoutes = require("./routes/conversations.routes");
const messagesRoutes = require("./routes/messages.routes");
const studyGroupsRoutes = require("./routes/studyGroups.routes");

const errorHandler = require("./middleware/error");

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/universities", universitiesRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/study-groups", studyGroupsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Global error handler (LAST)
app.use(errorHandler);

module.exports = app;
