import express from "express";
import OpenAI from "openai";
import Recording from "../models/recording.js";
import { protect } from "../middleware/authMiddleware.js";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

router.post("/transcribe/:id", protect, async (req, res) => {
  try {
const recording = await Recording.findOne({
  _id: req.params.id,
  userId: req.user._id,
});

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    // 🔥 Download file from your cloud storage URL
    const response = await axios.get(recording.fileUrl, {
      responseType: "stream",
    });

    const formData = new FormData();
    formData.append("file", response.data, {
  filename: "audio.webm",
});

    formData.append("model", "whisper-large-v3");

    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    recording.transcript = groqResponse.data.text;
    await recording.save();

    res.json({ transcript: groqResponse.data.text });

  } catch (err) {
    console.error("TRANSCRIPTION ERROR:", err.response?.data || err.message);
    res.status(500).json({ msg: "Transcription failed" });
  }
});
router.post("/summary/:id", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    if (!recording.transcript || recording.transcript.trim() === "") {
      return res.status(400).json({ msg: "Transcript required first" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Summarize the following transcript clearly and professionally.",
          },
          {
            role: "user",
            content: recording.transcript,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    recording.aiSummary = summary;
    await recording.save();

    res.json({ summary });

  } catch (err) {
    console.error("SUMMARY ERROR:", err.response?.data || err.message);
    res.status(500).json({ msg: "Summary failed" });
  }
});

export default router;
