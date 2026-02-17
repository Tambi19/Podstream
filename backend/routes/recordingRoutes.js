import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Recording from "../models/recording.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================
   ✅ Cloudinary Storage Setup
========================================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "podstream-recordings",
    resource_type: "video",
  },
});

const upload = multer({ storage });

/* =========================================
   ✅ Upload Recording (Cloudinary)
========================================= */
router.post("/upload", protect, upload.single("recording"), async (req, res) => {
  try {
    const { roomId, title } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const newRecording = await Recording.create({
      userId: req.user._id,
      roomId,
      title: title || "Untitled Recording",
      fileUrl: req.file.path, // ✅ Cloudinary secure URL
      publicId: req.file.filename, // store for deletion later
    });

    res.json({
      msg: "Uploaded to Cloudinary ✅",
      recording: newRecording,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* =========================================
   ✅ Get User Recordings
========================================= */
router.get("/", protect, async (req, res) => {
  try {
    const recordings = await Recording.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(recordings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch recordings" });
  }
});

/* =========================================
   ✅ Delete Recording (Also Remove From Cloudinary)
========================================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    // 🔥 Delete from Cloudinary
    if (recording.publicId) {
      await cloudinary.uploader.destroy(recording.publicId, {
        resource_type: "video",
      });
    }

    await recording.deleteOne();

    res.json({ msg: "Deleted from Cloudinary ✅" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

/* =========================================
   ✅ Update Title
========================================= */
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

    res.json({ msg: "Updated ✅", recording });
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
});

export default router;
