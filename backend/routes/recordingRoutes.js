import express from "express";
import multer from "multer";
import Recording from "../models/recording.js";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import { protect } from "../middleware/authMiddleware.js";
import fs from "fs";


const router = express.Router();

// ✅ FFmpeg path setup
ffmpeg.setFfmpegPath(ffmpegPath);

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ✅ Upload Recording (Protected) */
router.post("/upload", protect, upload.single("recording"), async (req, res) => {
  try {
    const { roomId, title } = req.body; // ✅ FIX HERE

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const newRecording = await Recording.create({
      userId: req.user._id,
      roomId,
      title: title || "Untitled Recording", // ✅ NOW SAFE
      filename: req.file.filename,
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    });

    res.json({ msg: "Uploaded ✅", recording: newRecording });
  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});


/* ✅ Get Logged-in User Recordings (Protected) */
router.get("/", protect, async (req, res) => {
  try {
    const recordings = await Recording.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(recordings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch recordings", error: err.message });
  }
});

/* ✅ Transcribe Recording (Protected + Only Owner Access) */
router.post("/:id/transcribe", protect, async (req, res) => {
  try {
    console.log("✅ TRANSCRIBE API HIT:", req.params.id);

    // ✅ Only allow transcription if this recording belongs to logged in user
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    const videoPath = path.join("uploads", recording.filename);
    const audioPath = path.join("uploads", `${recording._id}.mp3`);

    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .on("end", () => {
        execFile("py", ["./ai/transcribe.py", audioPath], async (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Whisper error:", error.message);
            console.error("stderr:", stderr);
            return res.status(500).json({
              msg: "Transcription failed",
              error: error.message,
            });
          }

          try {
            const output = JSON.parse(stdout);

            recording.transcript = output.text || "";
            await recording.save();

            return res.json({
              msg: "Transcribed ✅",
              transcript: recording.transcript,
            });
          } catch (e) {
            console.error("❌ JSON parse error:", e.message);
            console.log("stdout:", stdout);

            return res.status(500).json({
              msg: "Transcription failed",
              error: "Invalid output from Whisper",
            });
          }
        });
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg error:", err.message);
        return res.status(500).json({
          msg: "FFmpeg extract failed",
          error: err.message,
        });
      })
      .run();
  } catch (err) {
    console.error("❌ TRANSCRIBE ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) return res.status(404).json({ msg: "Recording not found" });

    await Recording.deleteOne({ _id: recording._id });

    res.json({ msg: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});
// ✅ Update recording title
router.put("/:id/title", protect, async (req, res) => {
  try {
    const { title } = req.body;

    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    recording.title = title || "Untitled Recording";
    await recording.save();

    res.json({ msg: "Title updated ✅", recording });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
});

router.get("/:id/mp4", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    const inputPath = path.join("uploads", recording.filename);
    const outputFileName = recording.filename.replace(".webm", ".mp4");
    const outputPath = path.join("uploads", outputFileName);

    // ✅ If mp4 already exists, directly send it
    if (fs.existsSync(outputPath)) {
      return res.download(outputPath);
    }

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .on("end", () => {
        return res.download(outputPath);
      })
      .on("error", (err) => {
        console.error("MP4 conversion error:", err.message);
        return res.status(500).json({ msg: "MP4 conversion failed" });
      })
      .run();
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});




export default router;
