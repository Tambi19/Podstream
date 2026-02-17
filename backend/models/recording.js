import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aiSummary: {
  type: String,
},

    roomId: { type: String, required: true },
    title: { type: String, default: "Untitled Recording" },

    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    transcript: { type: String, default: "" },
    publicId: {
  type: String,
},

  },
  { timestamps: true }
);

export default mongoose.model("Recording", recordingSchema);
