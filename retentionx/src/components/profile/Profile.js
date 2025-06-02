import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import './Profile.css';
import Sidebar from "../sidebar/sidebar";

const Profile = () => {
  const username = localStorage.getItem("username");
  const userEmail = localStorage.getItem("email");
  const [savedPhoneNumber, setSavedPhoneNumber] = useState("");
  const [memoxBalance, setMemoxBalance] = useState(0);
  const navigate = useNavigate();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const location = useLocation();

  const user = {
    email: userEmail || "user@example.com", // fallback
    avatar: `${process.env.PUBLIC_URL}/images/avatar.jpg`,
    bio: bioText,
    phone: savedPhoneNumber 
  };

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

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("whatsappNumber");
    navigate("/signin"); // Adjust the path if your login route is different
  };

  // Load saved data
  useEffect(() => {
    const storedNumber = localStorage.getItem("whatsappNumber");
    if (storedNumber) setSavedPhoneNumber("+91 " + storedNumber);

    const savedBio = localStorage.getItem("userBio");
    if (savedBio) setBioText(savedBio);

  }, []);

  useEffect(() => {
  if (location.state?.newTokens) {
    setMemoxBalance(location.state.newTokens);
    localStorage.setItem("memoxTokens", location.state.newTokens.toString());
  } else {
    const savedTokens = parseInt(localStorage.getItem("memoxTokens")) || 0;
    setMemoxBalance(savedTokens);
  }
}, [location.state]);

  const rewardTokens = (amount) => setMemoxBalance((prev) => prev + amount);
  const redeemTokens = (amount) => {
    if (memoxBalance >= amount) {
      setMemoxBalance((prev) => prev - amount);
    } else {
      alert("Not enough MEMOX credits.");
    }
  };
  
  return (
    <div className="profile-page">
      <Sidebar />
      <Container className="profile-wrapper">
        <Card className="profile-card p-4 mb-4">
          <div className="profile-header d-flex align-items-center">
            <img src={user.avatar} alt="Profile" className="profile-avatar me-4" />
            <div className="profile-info">
            <h2 className="profile-name mb-1">{username}</h2>

      {isEditingBio ? (
        <>
          <textarea
            className="form-control mb-2"
            rows={3}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
          />
          <div className="mb-2 d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                localStorage.setItem("userBio", bioText);
                setIsEditingBio(false);
              }}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setBioText(user.bio);
                setIsEditingBio(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="profile-bio">{user.bio || "No bio available."}</p>
          <button
            className="btn btn-outline-primary btn-sm mb-2"
            onClick={() => setIsEditingBio(true)}
          >
            Edit Bio
          </button>
        </>
      )}

      <p className="profile-email mb-1">{user.email}</p>
      <p className="profile-phone mb-1">📱 {user.phone}</p>

      <button onClick={handleLogout} className="btn btn-outline-danger mt-3">
        Logout
      </button>
    </div>
  </div>
</Card>

        <Row className="mb-4 profile-stats">
          <Col md={4}><Card className="p-3 stat-card"><h5>Total Uploads</h5><p>{totalUploads}</p></Card></Col>
          <Col md={4}><Card className="p-3 stat-card"><h5>Flashcards Generated</h5><p>{flashcardsGenerated}</p></Card></Col>
          <Col md={4}><Card className="p-3 stat-card"><h5>Credits Left</h5><p>{memoxBalance} MEMOX</p></Card></Col>
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

        {/* MEMOX Token Section */}
        <Card className="p-4 memox mb-4">
          <h5>🪙 MEMOX Token Dashboard</h5>
          <p><strong>MEMOX Balance:</strong> {memoxBalance} tokens</p>

          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={() => rewardTokens(5)}>+5 MEMOX (Reward)</button>
            <button className="btn btn-warning" onClick={() => redeemTokens(3)}>-3 MEMOX (Redeem)</button>
          </div>
        </Card>

      </Container>
    </div>
  );
};

export default Profile;
