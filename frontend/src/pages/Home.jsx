import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.png";
import bigImage from "../assets/big.png";
import big2image from "../assets/big2.png";


const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const footerTitle = {
  fontSize: "15px",
  fontWeight: "600",
  marginBottom: "15px",
  color: "#111827",
};

const FooterLink = ({ text }) => (
  <p
    style={{
      color: "#6B7280",
      fontSize: "14px",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "0.2s ease",
    }}
    onMouseEnter={(e) => (e.target.style.color = "#9b5cff")}
    onMouseLeave={(e) => (e.target.style.color = "#6B7280")}
  >
    {text}
  </p>
);


  return (
    <div>
      {/* HERO */}
      <section
  style={{
    position: "relative",
    minHeight: "100vh",
    paddingTop: "70px",   // 👈 IMPORTANT
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    overflow: "hidden",
  }}
>



  {/* Background Layer */}
  <div
    style={{
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition:
      window.innerWidth < 768
        ? "70% center"   // 👈 shifts focus to right person on mobile
        : "center", // 👈 focus on face side
    backgroundRepeat: "no-repeat",
    zIndex: -1,
    transform: "scale(1.05)", // slight zoom premium effect
    transition: "all 0.6s ease",
  }}
  />

  {/* Dark Overlay */}
  <div
    style={{
    position: "absolute",
    inset: 0,
    background: `
      linear-gradient(
        90deg,
        rgba(0,0,0,0.75) 0%,
        rgba(0,0,0,0.6) 40%,
        rgba(0,0,0,0.2) 70%,
        rgba(0,0,0,0.05) 100%
      )
    `,
    zIndex: -1,
  }}
  />

  {/* Content */}
  <div style={{ maxWidth: "800px", padding: "0 20px" }}>
    <h1
      style={{
        fontSize: "clamp(2rem, 5vw, 4rem)",
        fontWeight: 700,
        marginBottom: "20px",
        lineHeight: 1.1,
      }}
    >
      Create your best podcast yet.
    </h1>

    <p
      style={{
        fontSize: "clamp(1rem, 2vw, 1.2rem)",
        color: "#ddd",
        marginBottom: "30px",
      }}
    >
      Record, edit, repurpose, and distribute studio-quality
      content effortlessly with PodStream.
    </p>
    <button
  onClick={() => {
    if (user) {
      // Already logged in → go to studio with new room
      const newRoomId = Math.random().toString(36).substring(2, 8);
      navigate(`/studio/${newRoomId}`);
    } else {
      // Not logged in → go to login
      navigate("/login", { state: { fromHome: true } });
    }
  }}
  style={{
    padding: "14px 32px",
    borderRadius: "40px",
    border: "none",
    background: "#1e1c20",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }}
>
 Let’s Begin
</button>

  </div>
</section>


      {/* SECOND SECTION */}
      {/* SHOWCASE SECTION */}
{/* STUDIO QUALITY SECTION */}
<section
  style={{
    background: "#F7F7F9",
    padding: "120px 6%",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "60px",
      alignItems: "center",
    }}
  >
    {/* LEFT CONTENT */}
    <div>
      <h2
        style={{
          fontSize: "clamp(1.8rem,5vw,3.5rem)",
          fontWeight: "700",
          color: "#111",
          marginBottom: "25px",
          lineHeight: "1.1",
        }}
      >
        Studio-level quality.
        <br />
        No studio required.
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "#111",
            color: "white",
            fontSize: "12px",
            padding: "5px 10px",
            borderRadius: "20px",
            fontWeight: "600",
          }}
        >
          REC
        </span>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111",
          }}
        >
          Local recording for sharp video & audio
        </h3>
      </div>

      <p
        style={{
          marginTop: "15px",
          color: "#6B7280",
          fontSize: "16px",
          lineHeight: "1.7",
          maxWidth: "520px",
        }}
      >
        Capture up to 4K video and uncompressed audio in separate tracks,
        unaffected by internet connection.
      </p>

      {/* LARGE IMAGE */}
      <div
        style={{
          marginTop: "40px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.12)",
        }}
      >
        <img
          src={bigImage}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* 4K CARD */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        <span
          style={{
            background: "#E5E7EB",
            padding: "6px 12px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          4K
        </span>

        <h4
          style={{
            marginTop: "15px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#111",
          }}
        >
          High quality recording
        </h4>

        <img
          src={big2image}
          alt=""
          style={{
            width: "100%",
            borderRadius: "16px",
            marginTop: "20px",
            objectFit: "cover",
          }}
        />
      </div>

      {/* DOWNLOAD TRACKS CARD */}
      <div
        style={{
          background: "#111",
          borderRadius: "20px",
          padding: "20px",
          color: "white",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>
          Download separate tracks
        </h4>

        {["Marsha", "Stephen", "All Speakers"].map((name, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i !== 2
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
              fontSize: "14px",
            }}
          >
            <span>{name}</span>

            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ cursor: "pointer" }}>WAV</span>
              <span style={{ cursor: "pointer" }}>MP4</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>



      {/* MADE WITH PODSTREAM SECTION */}
<section
  style={{
    background: "#0E0E10",
    padding: "110px 0",
    overflow: "hidden",
  }}
>
  <h2
    style={{
      textAlign: "center",
      fontSize: "clamp(2rem,4vw,3rem)",
      fontWeight: "700",
      color: "white",
      marginBottom: "80px",
    }}
  >
    Made with PodStream
  </h2>

  <div
    style={{
      display: "flex",
      gap: "22px",
      width: "max-content",
      animation: "scrollX 20s linear infinite",
    }}
  >
    {[
      { type: "image", src: "/images/1.jpg" },
      { type: "image", src: "/images/2.jpg" },
      { type: "video", src: "/videos/1.mp4" },
      { type: "image", src: "/images/3.jpg" },
      { type: "image", src: "/images/4.jpg" },
      { type: "video", src: "/videos/3.mp4" },
    ]
      .concat([
        { type: "image", src: "/images/1.jpg" },
        { type: "image", src: "/images/2.jpg" },
        { type: "video", src: "/videos/1.mp4" },
        { type: "image", src: "/images/3.jpg" },
        { type: "image", src: "/images/4.jpg" },
        { type: "video", src: "/videos/3.mp4" },
      ])
      .map((item, i) => (
        <div
          key={i}
          style={{
            minWidth: "220px",        // ✅ smaller width
            height: "280px",          // ✅ controlled height
            borderRadius: "18px",
            overflow: "hidden",
            background: "#111",
            boxShadow: "0 25px 60px rgba(0,0,0,0.65)",
            transform: `translateY(${i % 2 === 0 ? "0px" : "25px"})`,
            transition: "all 0.4s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-12px) scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              i % 2 === 0 ? "translateY(0px)" : "translateY(25px)";
          }}
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <img
              src={item.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      ))}
  </div>
</section>



{/* FEATURES SECTION */}
<section
  style={{
    background: "#0B0B0D",
    padding: "140px 6%",
    color: "white",
  }}
>
  {/* Headline */}
  <h2
    style={{
      fontSize: "clamp(2.2rem,5vw,3.5rem)",
      fontWeight: "700",
      marginBottom: "80px",
      maxWidth: "700px",
      lineHeight: 1.2,
    }}
  >
    Want to level up your content?
    <br />
    Let PodStream handle the heavy lifting.
  </h2>

  <div
   style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "60px",
  alignItems: "center",
}}

  >
    {/* LEFT SIDE */}
    <div>
      <h3 style={{ fontSize: "28px", marginBottom: "15px" }}>
        🎙 Studio-quality recordings
      </h3>

      <p
        style={{
          color: "#A1A1AA",
          fontSize: "16px",
          lineHeight: "1.7",
          marginBottom: "30px",
          maxWidth: "500px",
        }}
      >
        Record crystal clear audio and video remotely.
        Separate tracks, real-time chat, screen sharing —
        everything you need in one powerful studio.
      </p>

      {/* Large Preview Image */}
      {/* Large Preview Image */}
<div
  style={{
    marginTop: "40px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
    maxWidth: "520px",         
    width: "100%",
    aspectRatio: "4 / 3",       
  }}
>
  <img
    src="/images/studio.jpg"
    alt="Studio Preview"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",       
      display: "block",
    }}
  />
</div>

    </div>

    {/* RIGHT SIDE CARDS */}
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {[
        {
          title: " AI Transcription",
          desc: "Instant, accurate transcripts for every recording.",
        },
        {
          title: "AI Summaries",
          desc: "Turn long conversations into ready-to-share insights.",
        },
        {
          title: "Auto Clips",
          desc: "Generate short viral-ready clips in seconds.",
        },
        {
          title: "One-click Publishing",
          desc: "Export and distribute everywhere effortlessly.",
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            background: "#151517",
            padding: "22px",
            borderRadius: "18px",
            border: "1px solid #1E1E22",
            transition: "0.3s ease",
          }}
        >
          <h4 style={{ marginBottom: "8px", fontSize: "18px" }}>
            {item.title}
          </h4>
          <p style={{ color: "#A1A1AA", fontSize: "14px" }}>
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
 
 <footer
  style={{
    background: "#F9F9FB",
    padding: "80px 6% 40px 6%",
    borderTop: "1px solid #E5E7EB",
    color: "#111827",
  }}
>
  {/* Top Grid */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "40px",
      marginBottom: "60px",
    }}
  >
    {/* Brand */}
    <div>
      <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>
        🎙 PodStream
      </h3>
      <p
        style={{
          color: "#6B7280",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        Professional podcast recording, AI transcription,
        editing & publishing — all in one place.
      </p>
    </div>

    {/* Company */}
    <div>
      <h4 style={footerTitle}>Company</h4>
      <FooterLink text="About Us" />
      <FooterLink text="Careers" />
      <FooterLink text="Partners" />
      <FooterLink text="Contact" />
    </div>

    {/* Product */}
    <div>
      <h4 style={footerTitle}>Product</h4>
      <FooterLink text="Studio" />
      <FooterLink text="AI Transcription" />
      <FooterLink text="AI Summary" />
      <FooterLink text="Library" />
      <FooterLink text="Pricing" />
    </div>

    {/* Resources */}
    <div>
      <h4 style={footerTitle}>Resources</h4>
      <FooterLink text="Blog" />
      <FooterLink text="Help Center" />
      <FooterLink text="Community" />
      <FooterLink text="Podcast Guides" />
    </div>

    {/* Legal */}
    <div>
      <h4 style={footerTitle}>Legal</h4>
      <FooterLink text="Privacy Policy" />
      <FooterLink text="Terms of Service" />
      <FooterLink text="Cookies Policy" />
    </div>
  </div>

  {/* Bottom Bar */}
  <div
    style={{
      borderTop: "1px solid #E5E7EB",
      paddingTop: "25px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "20px",
      fontSize: "14px",
      color: "#6B7280",
    }}
  >
    <p>© {new Date().getFullYear()} PodStream. All rights reserved.</p>

    <div style={{ display: "flex", gap: "20px" }}>
      <span style={{ cursor: "pointer" }}>Twitter</span>
      <span style={{ cursor: "pointer" }}>LinkedIn</span>
      <span style={{ cursor: "pointer" }}>YouTube</span>
    </div>
  </div>
</footer>


    </div>
  );
};

export default Home;
