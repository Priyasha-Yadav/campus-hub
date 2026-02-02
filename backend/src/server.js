require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const studyGroupReminderJob = require("./jobs/studyGroupReminder.job");

const app = require("./app");
const connectDB = require("./config/db");
const chatSocket = require("./socket/chat.socket");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

chatSocket(io);

connectDB().then(() => {
  studyGroupReminderJob();
  server.listen(process.env.PORT || 5001, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 5001}`);
  });
});
