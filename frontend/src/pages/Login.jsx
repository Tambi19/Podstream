import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || "/";

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data);

      navigate(from, { replace: true });
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed ❌");
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
          Log in to PodStream
        </h2>

        <p
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#A1A1AA",
            fontSize: "14px",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#9b5cff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Sign up
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background:
              "linear-gradient(135deg,#9b5cff,#6e3bff)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
        >
          Log in
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "13px",
            color: "#A1A1AA",
            cursor: "pointer",
          }}
        >
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default Login;
