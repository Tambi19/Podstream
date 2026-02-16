import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0E10",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#151517",
          padding: "40px 30px",
          borderRadius: "20px",
          border: "1px solid #1E1E22",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        {/* Title */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "28px",
            fontWeight: "600",
          }}
        >
          Create your account
        </h2>

        <p
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#A1A1AA",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#9b5cff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Log in
          </Link>
        </p>

        {/* Social Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {["G", "", "♫"].map((icon, i) => (
            <button
              key={i}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                border: "1px solid #1f1f22",
                background: "#1C1C1F",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              {icon}
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#6B7280",
            fontSize: "13px",
          }}
        >
          Or
        </p>

        {/* Name */}
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #1E1E22",
            background: "#1C1C1F",
            color: "white",
            marginBottom: "15px",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Email */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #1E1E22",
            background: "#1C1C1F",
            color: "white",
            marginBottom: "15px",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #1E1E22",
            background: "#1C1C1F",
            color: "white",
            marginBottom: "20px",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "linear-gradient(135deg,#9b5cff,#6e3bff)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Register;
