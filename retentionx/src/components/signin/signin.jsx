import React, { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { useNavigate } from "react-router-dom";
import "./signin.css";

export default function SignInPage() {
  const tiltRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 25,
        speed: 400,
        glare: true,
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "Advika_Singhal" && password === "password") {
      localStorage.setItem("username", "Advika Singhal"); // Replace with fetched full name in real app
      localStorage.setItem("email", email);

    // Grant 10 MEMOX once per day
    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-05-31"
    const lastLoginDate = localStorage.getItem("lastLoginDate");
    let currentTokens = parseInt(localStorage.getItem("memoxTokens")) || 0;

    if (lastLoginDate !== today) {
      currentTokens += 10;
      localStorage.setItem("memoxTokens", currentTokens);
      localStorage.setItem("lastLoginDate", today);
      alert("🎉 10 MEMOX granted for daily login!");
    } else {
      alert("🕒 Already logged in today. No extra MEMOX granted.");
    }
    console.log("Current tokens:", currentTokens);

    navigate("/dashboard", {
      state: {
        newTokens: currentTokens,
      },
    });
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="signin-page">
      <div className="login-container">
        <div ref={tiltRef} className="box">
          <div className="elements logo"></div>
          <div className="elements name">
            <h2>SIGN IN</h2>
          </div>
          <div className="elements content">
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Forgot Password Link */}
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
              <button className="login" type="submit">
                Sign In
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="card"></div>
        </div>
      </div>
    </div>
  );
}
