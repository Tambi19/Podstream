import sys
import json
import whisper

# usage: python transcribe.py path_to_audio.mp3
audio_path = sys.argv[1]

model = whisper.load_model("base")  # base/small/medium
result = model.transcribe(audio_path)

print(json.dumps({
    "text": result["text"],
}))
