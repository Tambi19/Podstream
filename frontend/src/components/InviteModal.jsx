import { useState } from "react";

const InviteModal = ({ roomId, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("guest");

  const inviteLink = `${window.location.origin}/studio/${roomId}?role=${role}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Link copied ✅");
  };

  const sendInvite = async () => {
    if (!email) return alert("Enter email");

    // You can connect this to backend later
    alert(`Invite sent to ${email} as ${role}`);
    setEmail("");
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Invite people</h3>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {/* Share Link Section */}
        <div style={{ marginTop: "25px" }}>
          <h4>🔗 Share a link</h4>
          <p style={subText}>Copy the link below and share with others.</p>

          <div style={inputRow}>
            <input value={inviteLink} readOnly style={inputStyle} />
            
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={selectStyle}
            >
              <option value="host">Host</option>
              <option value="guest">Guest</option>
            </select>

            <button onClick={copyLink} style={primaryBtn}>
              Copy link
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "25px 0" }}>Or</div>

        {/* Email Section */}
        <div>
          <h4>📩 Invite via email</h4>
          <p style={subText}>
            An email with instructions will be sent to invitees.
          </p>

          <div style={inputRow}>
            <input
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={selectStyle}
            >
              <option value="host">Host</option>
              <option value="guest">Guest</option>
            </select>

            <button onClick={sendInvite} style={primaryBtn}>
              Send invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000
};

const modalStyle = {
  width: "600px",
  background: "#1c1c1f",
  padding: "30px",
  borderRadius: "20px",
  color: "white",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const closeBtn = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer"
};

const inputRow = {
  display: "flex",
  gap: "10px",
  marginTop: "10px"
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  background: "#0e0e10",
  border: "1px solid #2a2a2e",
  borderRadius: "10px",
  color: "white"
};

const selectStyle = {
  padding: "10px",
  background: "#0e0e10",
  border: "1px solid #2a2a2e",
  borderRadius: "10px",
  color: "white"
};

const primaryBtn = {
  background: "linear-gradient(135deg,#9b5cff,#6e3bff)",
  border: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontWeight: "600"
};

const subText = {
  fontSize: "13px",
  color: "#9CA3AF"
};
