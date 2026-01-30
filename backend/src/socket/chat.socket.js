const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Join a conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, content } = data;

        const message = await Message.create({
          conversationId,
          senderId,
          content,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessageAt: new Date(),
        });

        io.to(conversationId).emit("receive_message", message);
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
