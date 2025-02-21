import React from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import Calendar from "../elements/calender/calender";
const Dashboard = () => {
  return (
    <Container fluid className="dashboard">
      {/* Sidebar */}
      <Row>
        <Col md={2} className="bg-light sidebar p-3">
          <h4 className="mb-4">📘 Learnthru</h4>
          <ListGroup>
            <ListGroup.Item action>📊 Dashboard</ListGroup.Item>
            <ListGroup.Item action>🏫 Classroom</ListGroup.Item>
            <ListGroup.Item action>🎥 Live Lessons</ListGroup.Item>
            <ListGroup.Item action>📂 Recorded Lessons</ListGroup.Item>
            <ListGroup.Item action>📚 Video Library</ListGroup.Item>
          </ListGroup>
          <div className="mt-5 p-3 text-center">
            <p>Need help?</p>
            <Button variant="primary" size="sm">
              24/7 Support
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={7} className="p-4">
          <Card className="p-4 shadow-sm">
            <h5>Welcome back, Stella Walton!</h5>
            <p>New French speaking classes are available. Learn more.</p>
            <Button variant="primary">Buy Lesson</Button>
          </Card>

          {/* Classes Section */}
          <Row className="mt-4">
            {["English - UNIT III", "English - UNIT II", "UNIT I"].map(
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
                        {idx === 0 ? "Leona Jimenez" : "Cole Chandler"}
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
              <ListGroup.Item>A1 - Bernard Carr | ✅ Done</ListGroup.Item>
              <ListGroup.Item>A1 - Henry Poole | ⏳ Pending</ListGroup.Item>
              <ListGroup.Item>A1 - Helena Lowe | ⏳ Pending</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Right Sidebar */}
        <Col md={3} className="bg-light p-4">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="rounded-circle mb-2"
            />
            <h6>Stella Walton</h6>
            <Button variant="outline-primary" size="sm">
              Profile
            </Button>
          </div>

          {/* Calendar Placeholder */}
          <Card className="mt-3 p-3">
            <h6>December 2022</h6>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-16">
                  <Calendar />
                </div>
              </div>
            </div>
          </Card>

          {/* Reminders */}
          <Card className="mt-3 p-3">
            <h6>🔔 Reminders</h6>
            <ListGroup>
              <ListGroup.Item>📖 Eng - Vocabulary Test</ListGroup.Item>
              <ListGroup.Item>✍️ Eng - Essay</ListGroup.Item>
              <ListGroup.Item>🗣️ Eng - Speaking Class</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
