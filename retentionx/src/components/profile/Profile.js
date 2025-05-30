import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { ethers } from "ethers";
import { MEMOX_TOKEN_ADDRESS } from "../../config";
import MEMOXTokenABI from "../../abi/MEMOXToken.json";
import './Profile.css';
import Sidebar from "../sidebar/sidebar";

const Profile = () => {
  const username = localStorage.getItem("username");
  const [savedPhoneNumber, setSavedPhoneNumber] = useState("");
  const navigate = useNavigate();

  const user = {
    email: 'advika@example.com',
    avatar: `${process.env.PUBLIC_URL}/images/avatar.jpg`,
    bio: 'Frontend Developer | Blockchain Explorer | Tech Mentor @ IGDTUW',
    phone: savedPhoneNumber 
  };

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  // Dummy data for stats and topics
  const totalUploads = 42;
  const flashcardsGenerated = 110;
  const topicsExcelled = ['React', 'Solidity', 'DSA'];
  const weakTopics = ['Redux', 'GraphQL'];

  // Generate consistency dummy grid
  const today = new Date();
  const consistencyGrid = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      active: Math.random() > 0.5
    };
  }).reverse();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      getTokenBalance(accounts[0], provider);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect MetaMask. Check console for details.");
    }
  };

  const getTokenBalance = async (userAddress, provider) => {
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        MEMOX_TOKEN_ADDRESS,
        MEMOXTokenABI.abi,
        signer
      );
      const bal = await tokenContract.balanceOf(userAddress);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.error("Error getting token balance:", err);
    }
  };
  
  const redeemCredits = async () => {
    try {
      if (!account || !balance) {
        alert("Please connect your wallet and ensure you have a valid balance.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        MEMOX_TOKEN_ADDRESS,
        MEMOXTokenABI.abi,
        signer
      );

      // Assuming a function redeem() in your smart contract
      const tx = await tokenContract.redeemCredits();
      await tx.wait(); // Wait for the transaction to be mined
      alert("Credits redeemed successfully!");

      // After redeeming, refresh the balance
      getTokenBalance(account, provider);
    } catch (err) {
      console.error("Error redeeming credits:", err);
      alert("Failed to redeem credits. Please check the console for details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("whatsappNumber");
    navigate("/login"); // Adjust the path if your login route is different
  };

  useEffect(() => {
    const storedNumber = localStorage.getItem("whatsappNumber");
    if (storedNumber) {
      setSavedPhoneNumber("+91 " + storedNumber);
    }
  }, []);

  return (
    <div className="profile-page">
      <Sidebar />
      <Container className="profile-wrapper">
        <Card className="profile-card p-4 mb-4">
          <div className="profile-header d-flex align-items-center">
            <img src={user.avatar} alt="Profile" className="profile-avatar me-4" />
            <div className="profile-info">
              <h2 className="profile-name mb-1">{username}</h2>
              <p className="profile-bio">{user.bio}</p>
              <p className="profile-email">{user.email}</p>
              <p className="profile-phone">📱 {user.phone}</p>
              <button onClick={handleLogout} className="btn btn-outline-danger mt-3">
                Logout
              </button>
            </div>
          </div>
        </Card>

        <Row className="mb-4 profile-stats">
          <Col md={4}><Card className="p-3 stat-card"><h5>Total Uploads</h5><p>{totalUploads}</p></Card></Col>
          <Col md={4}><Card className="p-3 stat-card"><h5>Flashcards Generated</h5><p>{flashcardsGenerated}</p></Card></Col>
          <Col md={4}><Card className="p-3 stat-card"><h5>Credits Left</h5><p>{balance} MEMOX</p></Card></Col>
        </Row>

        <Card className="p-4 mb-4">
  <h2 className="section-heading">Consistency Grid</h2>
  <div className="consistency-grid">
    {Array.from({ length: 140 }, (_, i) => (
      <div
        key={i}
        className={`grid-cell ${i % 3 === 0 ? "active" : ""}`} // Every 3rd cell active for demo
      ></div>
    ))}
  </div>
</Card>


        <Row className="mb-4 topic">
          <Col md={6}>
            <Card className="p-3">
              <h5 className="section-heading">🌟 Topics Excelled</h5>
              {topicsExcelled.map((topic, i) => <Badge bg="success" className="me-2 mb-2 badge" key={i}>{topic}</Badge>)}
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3">
              <h5 className="section-heading">⚠️ Topics to Improve</h5>
              {weakTopics.map((topic, i) => <Badge bg="danger" className="me-2 mb-2 badge" key={i}>{topic}</Badge>)}
            </Card>
          </Col>
        </Row>

        <Card className="p-4 memox">
          <h5>MEMOX Token Dashboard</h5>
          {account ? (
            <>
              <p><strong>Account:</strong> {account}</p>
              <p><strong>MEMOX Balance:</strong> {balance} MEMOX</p>
              <button onClick={redeemCredits} className="btn btn-warning">
                Redeem Credits
              </button>
            </>
          ) : (
            <button onClick={connectWallet} className="btn btn-primary">Connect Wallet</button>
          )}
        </Card>

      </Container>
    </div>
  );
};

export default Profile;
