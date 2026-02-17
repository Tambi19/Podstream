import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, User, Video, ArrowLeft } from "lucide-react";


const JoinStudioModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("role"); // role | guest

  const [roomInput, setRoomInput] = useState("");

  const createRoom = () => {
  const newRoomId = Math.random().toString(36).substring(2, 8);

  navigate(`/studio/${newRoomId}?role=host`);
};



  const joinRoom = () => {
  if (!roomInput) return alert("Enter room ID");

  let roomId = roomInput;

  if (roomInput.includes("/studio/")) {
    roomId = roomInput.split("/studio/")[1];
  }

  navigate(`/studio/${roomId}?role=guest`);
};



  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#151517",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        {step === "role" && (
          <>
            <h2 style={{ marginBottom: "25px" }}>Join Studio</h2>

            <button onClick={createRoom} style={btnStyle}>
  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Mic size={18} strokeWidth={2.2} />
    Join as Host
  </span>
</button>



            <button
  onClick={() => setStep("guest")}
  style={{ ...btnStyle, marginTop: "15px" }}
>
  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}  >
<User size={18} strokeWidth={2.2} />
  Join as Guest
  </span>
  
</button>


            <p
              style={{ marginTop: "20px", cursor: "pointer", color: "#9b5cff" }}
              onClick={onClose}
            >
              Cancel
            </p>
          </>
        )}

        {step === "guest" && (
          <>
            <h2 style={{ marginBottom: "20px" }}>Join as Guest</h2>

            <input
              placeholder="Enter Room ID or Invite Link"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0c0c14",
                color: "white",
                marginBottom: "15px",
              }}
            />

            <button onClick={joinRoom} style={btnStyle}>
  <User size={18} />
  Join Room
</button>


            <p
              style={{ marginTop: "20px", cursor: "pointer", color: "#9b5cff" }}
              onClick={() => setStep("role")}
            >
              ← Back
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#1e1c21",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",

  fontSize: "15px",
  lineHeight: "1",
};


export default JoinStudioModal;
