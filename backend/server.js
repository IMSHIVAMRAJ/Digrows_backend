require("dotenv").config();
const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const walletRoutes = require("./routes/wallet");
const chatRoutes = require("./routes/chat"); // ✅ Add chat route
const paymentRoutes = require("./routes/payment");
const Message = require("./models/Message");
const ChatSession = require("./models/ChatSession");
const User = require("./models/User");
const expertRoutes = require("./routes/expert");
const messageRoutes = require("./routes/messages");
const pitchRoutes = require('./routes/pitch');
const appointmentRoutes = require('./routes/appointment');
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const searchRoutes = require("./routes/search");
const adminRoutes = require("./routes/admin");
// Connect to DB
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ⚡️ Required for socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend URL for security
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
// ✅ Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/chat", chatRoutes); 
app.use("/api/payment", paymentRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/pitch', pitchRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/search", searchRoutes);


// ✅ Real-time Messaging Logic
io.on("connection", (socket) => {
  console.log("🟢 User connected to socket");

  socket.on("send_message", async ({ senderId, receiverId, content }) => {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return socket.emit("message_error", "Invalid sender or receiver");
    }

    // 🔐 Expert check logic
    const expertTypes = ["expert", "mentor", "investor"];
    if (expertTypes.includes(receiver.type)) {
      const session = await ChatSession.findOne({
        user: senderId,
        expert: receiverId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return socket.emit(
          "message_error",
          "Please pay to start chat with expert."
        );
      }
    }

    // 💬 Save and broadcast message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    io.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected from socket");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
