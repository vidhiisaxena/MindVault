import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import {LoginPage} from "../signup/login";
import "./landing.css"; 
import {Dashboard} from "../dashboard/Dashboard";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#">
            <div className="element-logo"> MindVault</div>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/Dashboard.jsx" className="nav-link-custom">
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
          <span className="grad-text">Unlock</span> your Potential
        </h1>
        <p className="hero-subtext">
          Maximize your coding potential with AI-powered learning and
          interview prep.
        </p>
        <Button variant="light" className="cta-button">
          Unleash the Powers of you Mind
        </Button>
      </Container>
    </div>
  );
}
