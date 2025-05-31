import React, { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import MEMOXTokenABI from "../../abi/MEMOXToken.json";
import './signup.css';

export default function SignUpPage() {
  const tiltRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const MEMOX_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

    // Dummy check (replace with real backend check)
    if (email === "Advika_Singhal" && password === "password") {
      localStorage.setItem("username", email);

      try {
        if (!window.ethereum) {
          alert("MetaMask not found!");
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const res = await fetch("http://localhost:3001/distribute-memox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toAddress: userAddress }),
        });

        const data = await res.json();
        if (data.success) {
          const memoxContract = new Contract(
            MEMOX_CONTRACT_ADDRESS,
            MEMOXTokenABI.abi,
            signer
          );

          const updatedBalance = await memoxContract.balanceOf(userAddress);
          const formattedBalance = formatUnits(updatedBalance, 18);
          localStorage.setItem("memoxBalance", formattedBalance);
          navigate("/dashboard");
        } else {
          alert("Token transfer failed");
        }
      } catch (error) {
        console.error("Login or token credit failed:", error);
        alert("Error during login or token distribution.");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  const handleOAuthLogin = (provider) => {
    alert(`OAuth with ${provider} coming soon!`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div ref={tiltRef} className="box">
          <div className="elements logo"></div>
          <div className="elements name">
            <h2>Sign Up</h2>
          </div>
          <div className="elements content">
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="submit">Sign Up</button>
              <div className="divider">or sign up with</div>
              <div className="social-buttons">
                <img src="/images/icons/google.png" alt="Google" width= "30px" onClick={() => handleOAuthLogin("Google")} />
                <img src="/images/icons/github.png" alt="GitHub" width= "30px" onClick={() => handleOAuthLogin("GitHub")} />
                <img src="/images/icons/linkedin.png" alt="LinkedIn" width= "30px" onClick={() => handleOAuthLogin("LinkedIn")} />
              </div>
            </form>
          </div>
          <div className="card"></div>
        </div>
      </div>
    </div>
  );
}
