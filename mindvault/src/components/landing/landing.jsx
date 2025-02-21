import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import {LoginPage} from "../signup/login";
import "./landing.css"; 

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#">
            <img src="/logo.png" alt="Atlas Logo" className="logo" /> MindVault
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#" className="nav-link-custom">
              Dashboard
            </Nav.Link>
            <Nav.Link href="/login.jsx" className="nav-link-custom">
              Sign in
            </Nav.Link>
            <Button variant="/login.jsx" className="signup-btn">
              Sign up free
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="hero-section text-center">
        <h1 className="hero-title">
          <span className="grad-text">Supercharge</span> your grades
        </h1>
        <p className="hero-subtext">
          Study, write, and solve faster with the most accurate AI for school.
        </p>
        <Button variant="light" className="cta-button">
          Use Atlas for free
        </Button>
      </Container>
    </div>
  );
}
