export const startRecording = (stream, onChunk) => {
  const options = [];

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
    options.push({ mimeType: "video/webm;codecs=vp9,opus" });
  } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
    options.push({ mimeType: "video/webm;codecs=vp8,opus" });
  } else if (MediaRecorder.isTypeSupported("video/webm")) {
    options.push({ mimeType: "video/webm" });
  }

  const mediaRecorder = new MediaRecorder(stream, options[0]);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      onChunk(e.data);
    }
  };

  // ✅ timeslice forces regular chunk output (VERY IMPORTANT)
  mediaRecorder.start(1000);

  return mediaRecorder;
};
