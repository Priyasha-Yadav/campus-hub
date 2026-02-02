const cron = require("node-cron");
const StudyGroup = require("../models/StudyGroup");

/**
 * Runs every 10 minutes
 * Sends reminder for sessions starting in the next 1 hour
 */
const studyGroupReminderJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(
        now.getTime() + 60 * 60 * 1000
      );

      const groups = await StudyGroup.find({
        isActive: true,
        "nextSession.at": {
          $gte: now,
          $lte: oneHourFromNow,
        },
        "notifications.sessionReminderSent": false,
      }).populate("members", "displayName email");

      for (const group of groups) {
        // 🔔 FOR NOW: log notification (later push/email)
        console.log(
          `🔔 Reminder: "${group.name}" session at ${group.nextSession.at}`
        );

        // TODO: send in-app / email / push notifications here

        group.notifications.sessionReminderSent = true;
        await group.save();
      }
    } catch (err) {
      console.error("Study group reminder job failed:", err);
    }
  });
};

module.exports = studyGroupReminderJob;
