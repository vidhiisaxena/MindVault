import React, { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";
import MEMOXTokenABI from "../../abi/MEMOXToken.json";
import "./login.css";

export default function LoginPage() {
  const tiltRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const MEMOX_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple check for this example, you can add API calls for actual authentication
    if (email === "Advika_Singhal" && password === "password") {
      // Save the username or email to localStorage
      localStorage.setItem("username", email);
      try {
        // Prompt MetaMask to connect
        if (!window.ethereum) {
          alert("MetaMask not found!");
          return;
        }
  
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        //call backend
        const res = await fetch("http://localhost:3001/distribute-memox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toAddress: userAddress }),
        });
        
        const data = await res.json();
        if (data.success) {
          console.log("MEMOX Credited! Tx:", data.txHash);

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
      }catch (error) {
        console.error("Login or token credit failed:", error);
        alert("Error during login or token distribution.");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div ref={tiltRef} className="box">
          <div className="elements logo"></div>
          <div className="elements name">
            <h2>Login</h2>
          </div>
          <div className="elements content">
            <form 
            onSubmit={handleLogin}
            >
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="login" type="submit">
                Login
              </button>
            </form>
          </div>
          <div className="card"></div>
        </div>
      </div>
    </div>
  );
}
