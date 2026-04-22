const cron = require("node-cron");
const StudyGroup = require("../models/StudyGroup");
const { createNotification } = require("../controllers/notifications.controller");

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
      }).populate(
        "members",
        "displayName email notificationPreferences"
      );

      for (const group of groups) {
        const sessionTime = group.nextSession?.at
          ? new Date(group.nextSession.at).toLocaleString()
          : "soon";

        const recipients = group.members.filter(
          (member) => member.notificationPreferences?.studyGroups !== false
        );

        await Promise.all(
          recipients.map((member) =>
            createNotification(
              member._id,
              "study-group",
              "Study group session reminder",
              `"${group.name}" starts at ${sessionTime}`,
              group._id,
              "StudyGroup"
            )
          )
        );

        // 🔔 FOR NOW: log notification (later push/email)
        console.log(
          `🔔 Reminder: "${group.name}" session at ${group.nextSession.at}`
        );

        group.notifications.sessionReminderSent = true;
        await group.save();
      }
    } catch (err) {
      console.error("Study group reminder job failed:", err);
    }
  });
};

module.exports = studyGroupReminderJob;
