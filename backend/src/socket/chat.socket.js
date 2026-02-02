const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const chatSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return next(new Error("Unauthorized"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.user._id.toString());

    socket.on("join_conversation", async (conversationId) => {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some(
        (id) => id.toString() === socket.user._id.toString()
      );

      if (
        !isParticipant ||
        conversation.university.toString() !== socket.user.university.toString()
      ) {
        return;
      }

      socket.join(conversationId);
    });

    socket.on("send_message", async ({ conversationId, content }) => {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some(
        (id) => id.toString() === socket.user._id.toString()
      );

      if (!isParticipant) return;

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        university: socket.user.university,
        content,
      });

      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      io.to(conversationId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.user._id.toString());
    });
  });
};

module.exports = chatSocket;
