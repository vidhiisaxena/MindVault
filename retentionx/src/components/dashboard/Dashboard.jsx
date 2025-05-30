import React, { useState, useEffect } from "react";
import { 
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Calendar from "react-calendar";
import GoogleCalendarAuth from "../elements/calender/calender";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,   
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import { useMemo } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedLinks, setUploadedLinks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const subjectCounts = uploadedFiles.reduce((acc, file) => {
    if (file.tag) {
      acc[file.tag] = (acc[file.tag] || 0) + 1;
    }
    return acc;
}, {});

const chartData = useMemo(() => ({
  labels: Object.keys(subjectCounts),
  datasets: [
    {
      label: "Uploads",
      data: Object.values(subjectCounts),
      backgroundColor: "blue",
    },
  ],
}), [uploadedFiles]); 

const handleDeleteSubject = (subjectToDelete) => {
  if (window.confirm(`Are you sure you want to delete the subject: ${subjectToDelete}?`)) {
    const updatedSubjects = subjects.filter(subject => subject !== subjectToDelete);
    setSubjects(updatedSubjects);
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
  }
};

 //Whatsapp Reminders
 const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
 const [whatsAppStep, setWhatsAppStep] = useState(1);
 const [phoneNumber, setPhoneNumber] = useState("");
 const fullPhoneNumber = "+91" + phoneNumber;

 const handleWhatsAppSubscribe = async () => {
   const response = await fetch("https://devcation-64ta.onrender.com/send-whatsapp", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       to: fullPhoneNumber,
       message: "You're now subscribed to reminders from RetentionX! 📚",
     }),
   });

   const data = await response.json();
   if (data.success) {
     alert("You've successfully subscribed to WhatsApp reminders! ✅");
     setShowWhatsAppPopup(false);
     localStorage.setItem("whatsappNumber", phoneNumber);
   } else {
     alert("Failed to send WhatsApp message. Please try again.");
   }
 };

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    const storedLinks = JSON.parse(localStorage.getItem("uploadedLinks")) || [];
    setUploadedFiles(storedFiles);
    setUploadedLinks(storedLinks);

    // Retrieve stored subjects from localStorage
    const storedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];

    // Extract only subject names (if objects are stored)
    const extractedSubjects = storedSubjects.map(subject =>
        typeof subject === "object" && subject.name ? subject.name : subject
    );

    // Default subjects that should always be shown
    const defaultSubjects = ["Machine Learning", "Neural Networks", "Deep Learning"];

    // Merge default subjects with stored subjects (avoiding duplicates)
    const mergedSubjects = [...new Set([...defaultSubjects, ...extractedSubjects])];

    setSubjects(mergedSubjects);
}, []);

  
  return (
    <Container fluid className="dashboard">
      {/* Sidebar */}
      <Row>
        <Col md={2} className="bg-light sidebar p-3">
          <h4 className="mb-4">Dashboard</h4>
          <ListGroup className="sideicons">
            <ListGroup.Item className="sideicon" action as={Link} to="../">💻 Home</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../uploadNotes">📚 Upload Notes</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../quiz">✅ Quiz</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../flashcardlist">🎴 Flashcards </ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../progress">📊 Progress Analytics</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../pomodoroTimer">⏰ Pomodoro Timer</ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col md={7} className="p-4">
          <Card className="p-4 shadow-sm">
            <h5>Welcome back, {username}!</h5> {/* Display the username here */}
            <p>Continue where you left off, explore new insights, or dive into your latest projects.</p>
            <Button id="buybtn" variant="primary">Ready to ace your game?🚀</Button>
          </Card>

          <Col md={7} className="p-4">
  <Card className="p-4 shadow-sm">
    <h5>Upload Statistics 📊</h5>
    <Bar data={chartData} />
  </Card>
</Col>

          {/* Classes Section */}
          <Row className="mt-4">
            {subjects.map(
              (subject, idx) => (
                <Col md={4} key={idx}>
                  <Card
                    className="text-white mb-3 position-relative"
                    style={{
                      backgroundColor:
                        idx === 0
                          ? "#007bff"
                          : idx === 1
                          ? "#6610f2"
                          : "#dc3545",
                        cursor: "pointer"
                    }}
                    onClick={() => setSelectedSubject(subject)} 
                  >
                    <Card.Body>
                      <Card.Title>{subject}</Card.Title>
                      
                    </Card.Body>
                    {/* Delete button */}
                    <Button
                      variant="light"
  size="sm"
  id="subject-delete-btn"
  className="subject-delete-btn position-absolute top-0 end-0 m-2"
  onClick={(e) => {
    e.stopPropagation(); // Prevent card click
    handleDeleteSubject(subject);
  }}
>
  🗑️
</Button>
        
                  </Card>
                </Col>
              )
            )}
          </Row>

          {/* Filtered Notes and Links Section */}
          {selectedSubject && (
            <Card className="p-3 shadow-sm mt-3">
              <h6>📂 Notes & Links for <strong>{selectedSubject}</strong></h6>
              <ListGroup>
                {uploadedFiles
                  .filter(file => file.tag === selectedSubject)
                  .map((file, idx) => (
                    <ListGroup.Item key={idx}>📄 {file.name}</ListGroup.Item>
                  ))}
                {uploadedLinks
                  .filter(link => link.tag === selectedSubject)
                  .map((link, idx) => (
                    <ListGroup.Item key={idx}>
                      🎥 <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
                    </ListGroup.Item>
                  ))}
                  
                {uploadedFiles.filter(f => f.tag === selectedSubject).length === 0 &&
                 uploadedLinks.filter(l => l.tag === selectedSubject).length === 0 && (
                  <ListGroup.Item>No notes or links uploaded for this subject yet.</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          )}

          {/* Lessons Section */}
          <Card className="p-3 shadow-sm">
            <h6>Lessons</h6>
            <ListGroup>
              <ListGroup.Item>A1 - Machine Learning | ✅ Done</ListGroup.Item>
              <ListGroup.Item>A1 - Neural Network | ⏳ Pending</ListGroup.Item>
              <ListGroup.Item>A1 - DBMS | ⏳ Pending</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Right Sidebar */}
        <Col md={3} className=" p-4">
          <div className="dashboard-profile-container text-center">
            <div className="dashboard-profile-image">
              <img
                src={`${process.env.PUBLIC_URL}/images/avatar.jpg`}
                alt="Profile"
              />
            </div>
            <h6>{username}</h6> {/* Display username here */}
            <Button variant="outline-primary" size="sm"  onClick={() => navigate('/profile')}>
              Profile
            </Button>
          </div>

          {/* Calendar Section */}
          <Card className="mt-3 p-3 calendar-card">
            <h6>📅 Calendar</h6>
            <div className="calendar-container">
              <Calendar className="custom-calendar" />
            </div>
          </Card>

          <Card className="mt-3 p-3">
  <GoogleCalendarAuth />
</Card>


          {/* Reminders */}
          <Card className="mt-3 p-3">
            <h6>🔔 Reminders</h6>
            <ListGroup>
              <ListGroup.Item>Today's Quiz❓</ListGroup.Item>
              <ListGroup.Item>Revise Flashcards📒</ListGroup.Item>
            </ListGroup>

            <Button
              variant="success"
              className="mt-2"
              onClick={() => {
                setShowWhatsAppPopup(true);
                setWhatsAppStep(1); 
              }}
            >
              Receive Reminders on WhatsApp 📲
            </Button>

            <Modal
              show={showWhatsAppPopup}
              onHide={() => setShowWhatsAppPopup(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Subscribe to WhatsApp Reminders</Modal.Title>
              </Modal.Header>

              <Modal.Body> 
              {whatsAppStep === 1 ? (
                <>
                  <p>
                    To receive reminders from <strong>RetentionX</strong> on WhatsApp, follow these steps:
                  </p>
                  <ol>
                    <li>Save the Twilio WhatsApp number: <strong>+1 415 523 8886</strong></li>
                    <li>Open WhatsApp and send the following code to the number:</li>
                  </ol>

                  <div className="text-center my-3">
                    <h5 className="border p-3 rounded bg-light">
                      <code>join using-zulu</code>
                    </h5>
                  </div>

                  <p>
                    Once you've sent the message, click "Next" to continue.
                  </p>
                </>
              ) : (
                <>
                <Form>
                  <Form.Group controlId="whatsappNumber">
                    <Form.Label>Enter your WhatsApp number</Form.Label>
                    <Form.Control
                      type="tel"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      placeholder="Enter your 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </>
              )}
            </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (whatsAppStep === 1) {
                      setShowWhatsAppPopup(false); 
                    } else {
                      setWhatsAppStep(1); 
                    }
                  }}
                >
                {whatsAppStep === 1 ? "Cancel" : "Back"}
                </Button>

    {whatsAppStep === 1 ? (
      <Button variant="primary" onClick={() => setWhatsAppStep(2)}>
        Next
      </Button>
    ) : (
      <Button variant="primary" onClick={handleWhatsAppSubscribe}>
        Subscribe
      </Button>
    )}
              </Modal.Footer>
            </Modal>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
