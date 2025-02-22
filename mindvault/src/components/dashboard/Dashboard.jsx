import React from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Container fluid className="dashboard">
      {/* Sidebar */}
      <Row>
        <Col md={2} className="bg-light sidebar p-3">
          <h4 className="mb-4">Dashboard</h4>
          <ListGroup className="sideicons">
            <ListGroup.Item className="sideicon" action as={Link} to="../flashcardlist">📚 Upload Notes</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../quiz">🗓️ Quiz</ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../flashcardlist">🎴 Flashcards </ListGroup.Item>
            <ListGroup.Item className="sideicon" action as={Link} to="../flashcardlist">📊 Progress Analytics</ListGroup.Item>
            {/* <ListGroup.Item action>🤖 AI Study Assistant</ListGroup.Item> */}
          </ListGroup>
          {/* <div className="mt-5 p-3 text-center">
            <p>Need help?</p>
            <Button variant="primary" size="sm">
              24/7 Support
            </Button>
          </div> */}
        </Col>

        {/* Main Content */}
        <Col md={7} className="p-4">
          <Card className="p-4 shadow-sm">
            <h5>Welcome back, Advika!</h5>
            <p>Continue where you left off, explore new insights, or dive into your latest projects.</p>
            <Button id="buybtn" variant="primary">Buy Lesson</Button>
          </Card>

          {/* Classes Section */}
          <Row className="mt-4">
            {["Machine Learning", "Neural Networks", "Deep Learning"].map(
              (subject, idx) => (
                <Col md={4} key={idx}>
                  <Card
                    className="text-white mb-3"
                    style={{
                      backgroundColor:
                        idx === 0
                          ? "#007bff"
                          : idx === 1
                          ? "#6610f2"
                          : "#dc3545",
                    }}
                  >
                    <Card.Body>
                      <Card.Title>{subject}</Card.Title>
                      <Card.Text>📁 {10 + idx * 2} Files</Card.Text>
                      <Card.Text>
                        👨‍🏫 Teacher:{" "}
                        {idx === 0 ? "Anshika Saxena" : "Mishthi Sachdeva" }
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )
            )}
          </Row>

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
        <div className="profile-container text-center">
            <div className="profile-image">
              <img
                src={`${process.env.PUBLIC_URL}/images/avatar.jpg`}
                alt="Profile"
              />
            </div>
            <h6>Advika</h6>
            <Button variant="outline-primary" size="sm">
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

          {/* Reminders */}
          <Card className="mt-3 p-3">
            <h6>🔔 Reminders</h6>
            <ListGroup>
              <ListGroup.Item>📖 Data Structures Test</ListGroup.Item>
              <ListGroup.Item>✍️ OOPs - Assignment</ListGroup.Item>
              <ListGroup.Item>🗣️ DBMS Viva</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
