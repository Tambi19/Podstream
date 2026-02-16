import express from "express";
import OpenAI from "openai";
import Recording from "../models/recording.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summary/:id", protect, async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ msg: "GROQ_API_KEY not loaded" });
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording || !recording.transcript) {
      return res.status(400).json({ msg: "Transcript not found" });
    }

    const transcript = recording.transcript.slice(0, 12000);

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional AI meeting assistant. Summarize clearly and structured.",
        },
        {
          role: "user",
          content: `
Summarize this meeting transcript.

Provide:
1. Short summary
2. Key points
3. Action items

Transcript:
${transcript}
          `,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    recording.aiSummary = aiResponse;
    await recording.save();

    res.json({ summary: aiResponse });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      msg: "AI generation failed",
      error: err.message,
    });
  }
});


export default router;
