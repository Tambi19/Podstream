import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recordingRoutes from "./routes/recordingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const allowedOrigins = [
  "http://localhost:5173",
  "https://podstream-i4wocu8n3-tambis-projects.vercel.app",
  "https://podstream-seven.vercel.app"
];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/ai", aiRoutes);



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("typing", ({ roomId, sender }) => {
  socket.to(roomId).emit("user-typing", sender);
});

socket.on("stop-typing", ({ roomId }) => {
  socket.to(roomId).emit("user-stop-typing");
});


  socket.on("send-message", ({ roomId, message, sender }) => {
  io.to(roomId).emit("receive-message", { message, sender });
});


 socket.on("join-room", ({ roomId, userName }) => {
  socket.join(roomId);

  socket.to(roomId).emit("user-joined", {
    userName,
  });
});


  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);
