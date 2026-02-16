import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  Download,
  Folder,
  Search,
  Clock,
  ArrowDownUp,
  Type,
  Brain,
  Sparkles,
  Trash2,
  Video,
  Home,
  Calendar,
  X
} from "lucide-react";


const Library = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
const [newTitle, setNewTitle] = useState("");
const [search, setSearch] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [page, setPage] = useState(1);
const [modalOpen, setModalOpen] = useState(false);
const [modalData, setModalData] = useState(null);
const [modalType, setModalType] = useState(null); 
// "transcript" or "summary"



const PER_PAGE = 5;



  const fetchRecordings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/recordings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecordings(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to load recordings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/recordings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Deleted ✅");
      fetchRecordings();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Delete failed ❌");
    }
  };

  const handleTranscript = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/recordings/${id}/transcribe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transcript generated ✅");
      fetchRecordings();
    } catch (err) {
      console.error("TRANSCRIBE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Transcription failed ❌");
    }
  };

  const handleUpdateTitle = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/recordings/${id}/title`,
      { title: newTitle },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Title updated ✅");

    setEditingId(null);
    setNewTitle("");

    fetchRecordings();
  } catch (err) {
    console.error("UPDATE TITLE ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.msg || "Title update failed ❌");
  }
};


const filteredRecordings = recordings.filter((rec) => {
  const q = search.toLowerCase();

  return (
    (rec.title || "").toLowerCase().includes(q) ||
    (rec.roomId || "").toLowerCase().includes(q) ||
    (rec.transcript || "").toLowerCase().includes(q)
  );
});
const sortedRecordings = [...filteredRecordings].sort((a, b) => {
  if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
  if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);

  if (sortBy === "title") {
    return (a.title || "").localeCompare(b.title || "");
  }

  return 0;
});
const totalPages = Math.ceil(sortedRecordings.length / PER_PAGE);

const paginatedRecordings = sortedRecordings.slice(
  (page - 1) * PER_PAGE,
  page * PER_PAGE
);
useEffect(() => {
  setPage(1);
}, [search, sortBy]);

const downloadTranscriptTXT = (rec) => {
  if (!rec.transcript || rec.transcript.trim() === "") {
    alert("No transcript to download ❌");
    return;
  }

  const text = `Title: ${rec.title || "Untitled Recording"}\nRoom: ${
    rec.roomId
  }\nDate: ${new Date(rec.createdAt).toLocaleString()}\n\nTranscript:\n${
    rec.transcript
  }`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${rec.title || "transcript"}.txt`;
  a.click();

  URL.revokeObjectURL(url);
};


const downloadTranscriptPDF = (title, transcript) => {
  const doc = new jsPDF();

  const safeTitle = (title || "Transcript").replace(/[^a-z0-9]/gi, "_");

  doc.setFontSize(16);
  doc.text(title || "Transcript", 10, 15);

  doc.setFontSize(12);

  const lines = doc.splitTextToSize(transcript, 180);
  doc.text(lines, 10, 30);

  doc.save(`${safeTitle}.pdf`);
};

const downloadModalPDF = () => {
  if (!modalData?.content) return;

  const doc = new jsPDF();

  const safeTitle = (modalData.title || "Transcript").replace(
    /[^a-z0-9]/gi,
    "_"
  );

  doc.setFontSize(16);
  doc.text(modalData.title || "Transcript", 10, 15);

  doc.setFontSize(12);

  const lines = doc.splitTextToSize(modalData.content, 180);
  doc.text(lines, 10, 30);

  doc.save(`${safeTitle}.pdf`);
};


const downloadMP4 = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/recordings/${id}/mp4`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.msg || "Download failed ❌");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.mp4";
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
    alert("MP4 download failed ❌");
  }
};

const btn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#7C3AED",
  color: "white",
  cursor: "pointer",
};

const dangerBtn = {
  ...btn,
  background: "#EF4444",
};

const section = {
  marginTop: "20px",
  padding: "15px",
  borderRadius: "12px",
  background: "#1a1a1d",
  border: "1px solid #1E1E22",
};


const generateSummary = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/ai/summary/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (res.ok) {
    alert("AI Summary Generated ✅");
    fetchRecordings();
  } else {
    alert(data.msg);
  }
};






  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading recordings...</h2>;
  }

  return (
  <div
    style={{
      background: "#0E0E10",
      minHeight: "100vh",
      padding: "100px 6%",
      color: "#FFFFFF",
    }}
  >
   <h2 style={{ 
  fontSize: "28px", 
  marginBottom: "25px",
  display: "flex",
  alignItems: "center",
  gap: "10px"
}}>
  <Folder size={26} />
  Recordings Library
</h2>


    {/* Search + Sort */}
    <div style={{ position: "relative" }}>
  <Search 
    size={18} 
    style={{ 
      position: "absolute", 
      top: "50%", 
      left: "12px", 
      transform: "translateY(-50%)",
      color: "#A1A1AA"
    }} 
  />
  <input
    placeholder="Search by title / room / transcript..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "12px 16px 12px 40px",
      width: "320px",
      borderRadius: "10px",
      border: "1px solid #1E1E22",
      background: "#151517",
      color: "#fff",
      outline: "none",
    }}
  />
</div>


    {/* Cards */}
   <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  }}
>

  {paginatedRecordings.map((rec) => (
    <div
      key={rec._id}
      style={{
        padding: "22px",
        borderRadius: "16px",
        background: "#151517",
        border: "1px solid #1E1E22",
        transition: "all 0.3s ease",
      }}
    >
      {/* Title */}
      <h3
        style={{
          marginBottom: "10px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {rec.title || "Untitled Recording"}
      </h3>

      <p style={{ 
  color: "#A1A1AA", 
  fontSize: "14px", 
  marginBottom: "4px",
  display: "flex",
  alignItems: "center",
  gap: "6px"
}}>
  <Home size={16} />
  Room: {rec.roomId}
</p>

<p style={{ 
  color: "#A1A1AA", 
  fontSize: "13px", 
  marginBottom: "15px",
  display: "flex",
  alignItems: "center",
  gap: "6px"
}}>
  <Calendar size={15} />
  {new Date(rec.createdAt).toLocaleString()}
</p>


      <video
        src={rec.fileUrl}
        controls
        style={{
          width: "100%",
          borderRadius: "12px",
          marginBottom: "18px",
        }}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
  style={btn}
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/recordings/${rec._id}/transcribe`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setModalData({
          title: rec.title || "Transcript",
          content: data.transcript,
        });

        setModalType("transcript");
        setModalOpen(true);   // ✅ IMPORTANT
      } else {
        alert(data.msg || "Transcript failed ❌");
      }
    } catch (err) {
      alert("Transcript error ❌");
    }
  }}
>
  <Brain size={16} style={{ marginRight: "6px" }} />
  Transcript
</button>



       <button
  style={btn}
  onClick={async () => {
    if (!rec.transcript || rec.transcript.trim() === "") {
      alert("⚠ Please generate transcript first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/ai/summary/${rec._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setModalData({
          title: "AI Summary",
          content: data.summary,
        });

        setModalType("summary");
        setModalOpen(true);   // ✅ IMPORTANT
      } else {
        alert(data.msg || "Summary failed ❌");
      }
    } catch (err) {
      alert("Summary error ❌");
    }
  }}
>
  <Sparkles size={16} style={{ marginRight: "6px" }} />
  AI Summary
</button>



        <button style={dangerBtn} onClick={() => handleDelete(rec._id)}>
          <Trash2 size={16} style={{ marginRight: "6px" }} />
  Delete
        </button>

        <button style={btn} onClick={() => downloadMP4(rec._id)}>
          <Download size={16} style={{ marginRight: "6px" }} />
  MP4
        </button>
      </div>

      {/* Transcript */}
      
    </div>
  ))}
</div>
{modalOpen && modalData && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px",
    }}
  >
    <div
      style={{
        background: "#151517",
        borderRadius: "16px",
        padding: "25px",
        maxWidth: "700px",
        width: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #1f1f22",
        color: "#E4E4E7",
        position: "relative",
      }}
    >
      <button
        onClick={() => setModalOpen(false)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
          color: "#aaa",
        }}
      >
        ✕
      </button>

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <h3 style={{ margin: 0 }}>
    {modalData.title}
  </h3>

  {modalType === "transcript" && (
    <button
      onClick={downloadModalPDF}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#9e63fd",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "10px",
        paddingRight: "20px",
      }}
    >
      <Download size={18} />
      PDF
    </button>
  )}
</div>

      <p style={{ lineHeight: "1.7", color: "#A1A1AA" }}>
        {modalData.content}
      </p>
    </div>
  </div>
)}


  </div>
);

};

export default Library;
