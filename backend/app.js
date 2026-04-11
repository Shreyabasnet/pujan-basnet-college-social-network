import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import config from "./src/config/config.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import announcementRoutes from "./src/routes/announcement.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import teacherRoutes from './src/routes/teacher.routes.js';
import studentRoutes from './src/routes/student.routes.js';
import connectDB from "./src/config/db.js";
import connectCloudinary from "./src/config/cloudinary.js";

const app = express();
const httpServer = createServer(app);

// Socket.io setup with CORS - allow specific origin with credentials
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://pujan-basnet-college-social-network.vercel.app",
      process.env.FRONTEND_URL || ""
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware - allow specific origins with credentials
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://pujan-basnet-college-social-network.vercel.app",
    process.env.FRONTEND_URL || ""
  ].filter(Boolean),
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    name: "CollegeSocial API",
    port: config.port,
    status: "OK",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("send_message", (data) => {
    const { receiverId, senderId, message } = data;
    io.to(receiverId).emit("receive_message", {
      senderId,
      message
    });
  });

  socket.on("unsend_message", (data) => {
    const { receiverId, senderId, messageId } = data;
    io.to(receiverId).emit("message_unsent", {
      senderId,
      messageId,
    });
  });

  socket.on("typing", (data) => {
    socket.to(data.receiverId).emit("user_typing", {
      senderId: data.senderId
    });
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.receiverId).emit("user_stop_typing", {
      senderId: data.senderId
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Initialize and Start Server
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    httpServer.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${config.port} is already in use. Stop the existing server or change PORT in backend/.env.`);
        process.exit(1);
      }

      console.error("Server error:", error.message);
      process.exit(1);
    });

    httpServer.listen(config.port, () => {
      console.log(`Server running at port ${config.port}...`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
