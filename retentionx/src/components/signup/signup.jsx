import React, { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { useNavigate } from "react-router-dom";
import './signup.css';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function SignUpPage() {
  const tiltRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

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

    if (!email || !password || !confirmPassword || !fullName) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Dummy credentials for testing (replace with backend auth)
    if (email === "Advika_Singhal" && password === "password") {
      localStorage.setItem("username", fullName);
      localStorage.setItem("email", email);
      
          navigate("/dashboard");
    }
       else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div ref={tiltRef} className="box">
          <div className="elements logo"></div>
          <div className="elements name">
            <h2>SIGN UP</h2>
          </div>
          <div className="elements content">
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="login" type="submit">
                Sign Up
              </button>
              
              <p className="signup-or">or sign up with</p>
            <div className="signup-socials">
              <FaGoogle className="social-icon" />
              <FaGithub className="social-icon" />
              <FaLinkedin className="social-icon" />
            </div>
            <p className="already-account">
  Already have an account?{" "}
  <span 
    className="signin-link" 
    onClick={() => navigate("/signin")}  >
    Sign in
  </span>
</p>

            </form>

          </div>
          <div className="card"></div>
        </div>
      </div>
    </div>
  );
}
