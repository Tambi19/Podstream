import express from "express";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get room chat history
router.get("/:roomId", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load chat" });
  }
});

// ✅ Save new message
router.post("/", protect, async (req, res) => {
  try {
    const { roomId, message } = req.body;

    const newMessage = await Chat.create({
      roomId,
      sender: req.user.name,
      message,
    });

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ msg: "Failed to save message" });
  }
});

export default router;
