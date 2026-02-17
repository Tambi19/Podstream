import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { createPeerConnection } from "../webrtc/peer";
import { startRecording } from "../webrtc/recorder";
import { useParams, useLocation } from "react-router-dom";
import JoinStudioModal from "../components/JoinStudioModal";
import InviteModal from "../components/InviteModal";
import {
  Upload,
  CircleStop,
  House,
  Plus,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  LogOut,
  Disc,
  MessageSquareMore,
  SendHorizontal
} from "lucide-react";





const Studio = () => {
  const { roomId } = useParams();
  useEffect(() => {
  // When room changes, reset everything
  setJoined(false);
  setRecording(false);
  setRecordedUrl(null);
  setStatus("Not joined");

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  if (pcRef.current) {
    pcRef.current.close();
    pcRef.current = null;
  }

}, [roomId]);


  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const location = useLocation();
const role = location.state?.role || null;
const [participants, setParticipants] = useState([]);
const [remoteUserName, setRemoteUserName] = useState(null);
const [showInviteModal, setShowInviteModal] = useState(false);
const API = import.meta.env.VITE_API_URL;





  const [status, setStatus] = useState("Not joined");
  const [showJoinModal, setShowJoinModal] = useState(false);


  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);




  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [joined, setJoined] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  const [title, setTitle] = useState("");
  const [seconds, setSeconds] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
const senderName = user?.name || "User";


  // ✅ CHAT STATES
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const iconBtnStyle = {
  background: "#222",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "16px",
};



  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);




  /* 🔌 Init socket once */
  useEffect(() => {
socketRef.current = io(API, {
  transports: ["websocket"],
  withCredentials: true,
});



  socketRef.current.on("receive-message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  socketRef.current.on("user-typing", (sender) => {
    setTypingUser(sender);
  });

  socketRef.current.on("user-stop-typing", () => {
    setTypingUser(null);
  });

  

  return () => {
    if (socketRef.current) {
      socketRef.current.off("receive-message");
      socketRef.current.off("user-typing");
      socketRef.current.off("user-stop-typing");
      socketRef.current.disconnect();
    }
  };
}, []);

 
  /* ✅ Recording Timer */
  useEffect(() => {
    let interval;

    if (recording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recording]);

  /* 🎥 Join Studio */
  const startStudio = async () => {
    if (!roomId) {
      alert("Room ID missing");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
      streamRef.current = stream;

      setJoined(true);
      setStatus("Waiting for participant...");

      const loadChatHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/api/chats/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setMessages(data);
};


      socketRef.current.emit("join-room", {
  roomId,
  userName: senderName,
});

await loadChatHistory();



     socketRef.current.on("user-joined", async (data) => {
  // 🔹 Set username
  setRemoteUserName(data.userName);

  // 🔹 Start WebRTC
  setStatus("Participant joined ✅ Connecting...");

  pcRef.current = createPeerConnection(
    socketRef.current,
    roomId,
    stream,
    remoteVideoRef
  );

  const offer = await pcRef.current.createOffer();
  await pcRef.current.setLocalDescription(offer);

  socketRef.current.emit("offer", { roomId, offer });
});


      socketRef.current.on("offer", async (offer) => {
        setStatus("Connecting... 🔄");

        


        pcRef.current = createPeerConnection(
          socketRef.current,
          roomId,
          stream,
          remoteVideoRef
        );

        await pcRef.current.setRemoteDescription(offer);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socketRef.current.emit("answer", { roomId, answer });
      });

      socketRef.current.on("answer", async (answer) => {
        setStatus("Connected ✅");
        await pcRef.current.setRemoteDescription(answer);
      });

      socketRef.current.on("ice-candidate", async (candidate) => {
        if (pcRef.current) {
          await pcRef.current.addIceCandidate(candidate);
        }
      });
    } catch (err) {
      console.error(err);
      alert("Please allow camera & mic access");
    }
  };

  useEffect(() => {
  if (role && roomId) {
    startStudio();
  }
}, [roomId]);

useEffect(() => {
  if (role) {
    setShowJoinModal(false);
  }
}, [role]);



  /* 🎤 Toggle Mic */
  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  /* 🎥 Toggle Camera */
  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setCamOn(videoTrack.enabled);
  };

  /* 🚪 Leave Room */
  const leaveRoom = () => {
    if (recorderRef.current && recording) {
      try {
        recorderRef.current.stop();
      } catch (e) {}
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setJoined(false);
    setRecording(false);
    setRecordedUrl(null);
    setStatus("Not joined");

    alert("Left room ✅");
  };

  /* 🎙️ Start Recording */
  const handleStartRecording = () => {
    if (!streamRef.current) {
      alert("Stream not ready ❌");
      return;
    }

    setSeconds(0);
    recordedChunks.current = [];

    const mediaRecorder = startRecording(
      streamRef.current,
      (chunk) => recordedChunks.current.push(chunk)
    );

    recorderRef.current = mediaRecorder;
    setRecording(true);
  };

  /* ⏹️ Stop Recording */
  const handleStopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });

      if (blob.size === 0) {
        alert("Recording failed");
        return;
      }

      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setRecording(false);
    };

    recorderRef.current.stop();
  };

  const handleScreenShare = async () => {
  if (!pcRef.current) {
    alert("Not connected yet ❌");
    return;
  }

  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];

    const sender = pcRef.current
      .getSenders()
      .find((s) => s.track && s.track.kind === "video");

    if (sender) {
      await sender.replaceTrack(screenTrack);
    }

    // Show screen locally
    localVideoRef.current.srcObject = screenStream;

    setScreenSharing(true);

    // When user clicks "Stop sharing"
    screenTrack.onended = () => {
      stopScreenShare();
    };
  } catch (err) {
    console.error("Screen share error:", err);
  }
};


const stopScreenShare = async () => {
  if (!streamRef.current || !pcRef.current) return;

  const cameraTrack = streamRef.current
    .getTracks()
    .find((track) => track.kind === "video");

  const sender = pcRef.current
    .getSenders()
    .find((s) => s.track && s.track.kind === "video");

  if (sender && cameraTrack) {
    await sender.replaceTrack(cameraTrack);
  }

  // Restore camera locally
  localVideoRef.current.srcObject = streamRef.current;

  setScreenSharing(false);
};

const styles = `
.studio-main {
  flex: 1;
  display: grid;
  grid-template-columns: 4fr 1fr; /* 80% video, 20% chat */
  gap: 20px;
  padding: 20px 40px;
}

.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.chat-sidebar {
  background: #151517;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 500px;
}

.video-card {
  background: #151517;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
}

@media (max-width: 1024px) {
  .studio-main {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }

  .chat-sidebar {
    min-height: 350px;
  }
}

.studio-header {
  padding: 20px 40px;
  border-bottom: 1px solid #1E1E22;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 📱 MOBILE HEADER */
@media (max-width: 768px) {
  .studio-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .studio-header button {
    width: 100%;
    justify-content: center;
  }
}

`;




  /* ⬆️ Upload */
  const handleUpload = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must login first ❌");
        return;
      }

      const blob = await fetch(recordedUrl).then((r) => r.blob());

      const formData = new FormData();
      formData.append("recording", blob, "recording.webm");
      formData.append("roomId", roomId);
      formData.append("title", title || "Untitled Recording");

      const res = await fetch(`${API}/api/recordings/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Upload failed ❌");
        return;
      }

      alert("Uploaded ✅");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed ❌");
    }
  };



  // ✅ SEND MESSAGE FUNCTION
  const sendMessage = async () => {
  if (!chatInput.trim()) return;

  const token = localStorage.getItem("token");

  await fetch(`${API}/api/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      roomId,
      message: chatInput,
    }),
  });

  socketRef.current.emit("send-message", {
    roomId,
    sender: senderName,
    message: chatInput,
  });

  setChatInput("");
};

const controlBtnStyle = (active) => ({
  background: active ? "#9b5cff" : "#222",
  border: "none",
  padding: "12px",
  borderRadius: "50%",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  width: "45px",
  height: "45px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s ease",
});




 return (
  <>
    <style>{styles}</style>
  <div
  style={{
    minHeight: "100vh",
    background: "#0E0E10",
    color: "white",
    paddingTop: "80px",
    paddingBottom: joined ? "140px" : "40px", // ✅ ADD THIS
    display: "flex",
    flexDirection: "column",
  }}
>

    {/* HEADER */}
    <div className="studio-header">

      <div>
        <h2
  style={{
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
  }}
>
  <House size={22} />
  Your Studio
</h2>

        <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF" }}>
          Room: {roomId}
        </p>
      </div>

      {!joined ? (
       <button
  onClick={() => setShowJoinModal(true)}
  style={{
    background: "black",
    border: "none",
    padding: "10px 22px",
    borderRadius: "30px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <Video size={18} />
  Join Studio
</button>


      ) : (
        
        <div style={{ display: "flex", gap: "15px" }}>
    
    {/* Invite Button */}
    <button
  onClick={() => setShowInviteModal(true)}
  style={{
    background: "#1f1f23",
    border: "1px solid #2a2a2e",
    padding: "10px 22px",
    borderRadius: "30px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  <Plus size={16} />
  Invite
</button>


    {/* Leave Button */}
    <button
      onClick={leaveRoom}
      style={{
        background: "#000000",
        border: "none",
        padding: "10px 22px",
        borderRadius: "30px",
        color: "white",
        cursor: "pointer",
      }}
    >
      <LogOut size={18} />

    </button>

  </div>

        
      )}
    </div>

    {/* MAIN GRID */}
    {/* MAIN GRID */}
<div
  
    className="studio-main"

>





      {/* VIDEO SECTION */}
      {/* VIDEO SECTION */}
<div
  
    className="video-grid"

>



        {/* LOCAL VIDEO */}
        <div className="video-card">



          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <span
  style={{
    position: "absolute",
    bottom: "12px",
    left: "12px",
    background: "rgba(0,0,0,0.6)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
  }}
>
  {role === "host" ? "👤" : "👤"} {senderName} (You)
</span>

        </div>

        {/* REMOTE VIDEO */}
       <div className="video-card">


        
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
         <span
  style={{
    position: "absolute",
    bottom: "12px",
    left: "12px",
    background: "rgba(0,0,0,0.6)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  }}
>
    {remoteUserName ? remoteUserName : "Waiting..."}

</span>

        </div>
      </div>

      {/* CHAT SIDEBAR */}
    <div className="chat-sidebar">




        <div
  style={{
    padding: "16px",
    borderBottom: "1px solid #1E1E22",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }}
>
  <MessageSquareMore size={18} />
  Live Chat
</div>


        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {messages.map((m, i) => {
            const isMe = m.sender === senderName;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    background: isMe ? "#8d75b2" : "#222",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    fontSize: "14px",
                    maxWidth: "75%",
                  }}
                >
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            padding: "12px",
            borderTop: "1px solid #1E1E22",
            gap: "10px",
          }}
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "#0E0E10",
              border: "1px solid #1E1E22",
              borderRadius: "12px",
              padding: "10px",
              color: "white",
            }}
          />
          <button
  onClick={sendMessage}
  style={{
    background: "#060509",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <SendHorizontal size={18} />
</button>

        </div>
      </div>
    </div>

    {/* CONTROL BAR */}
{joined && (
  <div
    style={{
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#151517",
  padding: "12px 20px",
  borderRadius: "50px",
  display: "flex",
  gap: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  zIndex: 1000,
  width: "90%",
  maxWidth: "400px",
  justifyContent: "center",
}
}
  >
   <button onClick={toggleMic} style={iconBtnStyle}>
  {micOn ? <Mic size={18} /> : <MicOff size={18} />}
</button>


    <button onClick={toggleCamera} style={iconBtnStyle}>
      {camOn ? <Video size={18} /> : <VideoOff size={18} />}
    </button>

    <button onClick={handleScreenShare} style={iconBtnStyle}>
      <MonitorUp size={18} />

    </button>

    <button
      onClick={leaveRoom}
      style={{
        ...iconBtnStyle,
        background: "#ff4d4d",
      }}
    >
      <LogOut size={18} />

    </button>
  </div>
)}


    {/* RECORDING SECTION */}
    {joined && role === "host" && (

      <div
  style={{
    padding: "20px",
    borderTop: "1px solid #1E1E22",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  }}
>

        <input
          placeholder="Recording title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#151517",
  color: "white",
  cursor: "pointer" ,
  flex: "0.2",
  minWidth: "160px",
}}

        />

        {!recording ? (
          <button
            onClick={handleStartRecording}
            style={{
               background: "#ff4d4d",
    border: "none",
    padding: "10px 22px",
    borderRadius: "25px",
    color: "white",
    cursor: "pointer",

    alignItems: "center",
    justifyContent: "center",
    gap: "10px",

    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1",
            }}
          >
            <Disc  size={16}
    strokeWidth={2.5}
    style={{ transform: "translateY(1px)" }} />


          </button>
        ) : (
          <button
  onClick={handleStopRecording}
  style={{
    background: "#ff4d4d",
    border: "none",
    padding: "10px 22px",
    borderRadius: "25px",
    color: "white",
    cursor: "pointer",

    alignItems: "center",
    justifyContent: "center",
    gap: "10px",

    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1",
  }}
>
  <CircleStop
    size={16}
    strokeWidth={2.5}
    style={{ transform: "translateY(1px)" }}
  />
 
</button>

        )}

        {recordedUrl && (
         <button
  onClick={handleUpload}
  style={{
    marginLeft: "15px",
    background: "#000000",
    border: "none",
    padding: "10px 22px",
    borderRadius: "25px",
    color: "white",
    cursor: "pointer",

    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1",
  }}
>
  <Upload
  gap={4}
    size={16}
    strokeWidth={2.5}
    style={{ transform: "translateY(1px)" }}
  />
  <span>Upload</span>
</button>

        )}
      </div>
    )}
    {/* JOIN MODAL */}
{showJoinModal && (
  <JoinStudioModal onClose={() => setShowJoinModal(false)} />
)}

{showInviteModal && (
  <InviteModal
    roomId={roomId}
    onClose={() => setShowInviteModal(false)}
  />
)}


  </div>
  </>
);

};


export default Studio;
