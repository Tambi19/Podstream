import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import logo from "../assets/logo2.png";



const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);



  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".profile-menu")) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navTextColor = scrolled ? "#111" : "#fff";
  const hoverColor = "#b3a5c9";

  return (
    <>
      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
padding: isMobile ? "0 16px 0 0px" : "0 6%",

          zIndex: 9999,
          transition: "all 0.3s ease",
          backgroundColor: scrolled ? "#ffffff" : "transparent",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "none",
          borderBottom: scrolled ? "1px solid #eee" : "none",
        }}
      >
        {/* Logo */}
        <div
  onClick={() => navigate("/")}
  style={{
    paddingTop: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    cursor: "pointer",
    marginLeft: isMobile ? "-10px" : "0px"
  }}
>
  <img
  src={logo}
  alt="PodStream"
  style={{
height: scrolled ? "60px" : "68px",
    transform: "scale(2.2)",   // enlarge visually
    transformOrigin: "left center",
    transition: "all 0.3s ease",
    filter: scrolled ? "none" : "invert(1)"
  }}
/>

</div>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
            {["Home", "Library", ...(user ? ["Studio"] : [])].map((item) => (
  <Link
    key={item}
    to={
      item === "Home"
        ? "/"
        : item === "Library"
        ? "/library"
        : "/studio/new"
    }
    onMouseEnter={() => setHovered(item)}
    onMouseLeave={() => setHovered(null)}
    style={{
      textDecoration: "none",
      color: hovered === item ? hoverColor : navTextColor,
      transition: "0.3s ease",
      fontWeight: 500,
      fontSize: "1.1rem",
    }}
  >
    {item}
  </Link>
))}


            {user ? (
              <>
                <div className="profile-menu" style={{ position: "relative" }}>
  <div
    onClick={() => setProfileOpen(!profileOpen)}
    style={{
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "#1e1b23",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "white"
    }}
  >
    <User size={18} />
  </div>

  {profileOpen && (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "50px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "200px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999
      }}
    >
      {/* User Info */}
      <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
          {user.email}
        </p>
      </div>

      {/* Profile Button */}
      <button
        onClick={() => {
          navigate("/profile");
          setProfileOpen(false);
        }}
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          padding: "8px 0"
        }}
      >
        <Settings size={16} />
        Profile
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          color: "#e11d48",
          padding: "8px 0"
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )}
</div>

                
              </>
            ) : (
              <>
                <Link to="/login">
                  <button
                    style={{
                      padding: "8px 18px",
                      borderRadius: "30px",
                      border: scrolled
                        ? "1px solid #ddd"
                        : "1px solid white",
                      background: "transparent",
                      color: navTextColor,
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button
                    style={{
                      padding: "8px 20px",
                      borderRadius: "30px",
                      border: "none",
                      background:
                        "linear-gradient(135deg,#9b5cff,#6e3bff)",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              fontSize: "1.8rem",
              cursor: "pointer",
              color: navTextColor,
              zIndex: 10000,
            }}
          >
            ☰
          </div>
        )}
      </nav>

      {/* MOBILE DROPDOWN (OUTSIDE NAV) */}
     {isMobile && menuOpen && (
  <div
    style={{
      position: "fixed",
      top: "70px",
      left: 0,
      width: "100%",
      background: "#111",
      padding: "25px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      zIndex: 9998,
      borderBottom: "1px solid #1f1f1f",
    }}
  >
    {/* Navigation Links */}
    {["Home", "Library", ...(user ? ["Studio"] : [])].map((item) => (
      <Link
        key={item}
        to={
          item === "Home"
            ? "/"
            : item === "Library"
            ? "/library"
            : "/studio/new"
        }
        onClick={() => setMenuOpen(false)}
        style={{ color: "#fff", textDecoration: "none" }}
      >
        {item}
      </Link>
    ))}

    {/* Profile Section */}
    {user && (
  <div style={{ marginTop: "10px" }}>
    
    {/* Profile Trigger Row */}
    <div
      onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        padding: "10px 0",
        borderTop: "1px solid #222",
        color: "#fff"
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#9b5cff,#6e3bff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: "14px"
        }}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>

      <span>Account</span>
    </div>

    {/* Expandable Profile Section */}
    {mobileProfileOpen && (
      <div
        style={{
          marginTop: "10px",
          paddingLeft: "42px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "#aaa",
          fontSize: "14px"
        }}
      >
        <div>
          {user.name}
          <br />
          {user.email}
        </div>

        <Link
          to="/profile"
          onClick={() => {
            setMenuOpen(false);
            setMobileProfileOpen(false);
          }}
          style={{ color: "#9b5cff", textDecoration: "none" }}
        >
          Profile
        </Link>

        <button
          onClick={() => {
            handleLogout();
            setMenuOpen(false);
            setMobileProfileOpen(false);
          }}
          style={{
            background: "transparent",
            border: "1px solid #9b5cff",
            color: "#9b5cff",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}


    {!user && (
      <>
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Login
        </Link>

        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          style={{ color: "#9b5cff", textDecoration: "none" }}
        >
          Register
        </Link>
      </>
    )}
  </div>
)}

    </>
  );
};

export default Navbar;
