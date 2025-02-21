import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
// import {LoginPage} from "../signup/login";
import "./landing.css"; 
// import {Dashboard} from "../dashboard/Dashboard";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar className="navbar" >
        <Container>
          <Navbar.Brand>
          <div className="element logo"></div>
            {/* <div className="element-logo"> MindVault</div> */}
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button href="/Dashboard" type="button" id="navbtn" className="btn btn-outline-secondary">
              Dashboard
            </Button>
            <Button href="/login" type="button" id="navbtn" className="btn btn-outline-secondary">
              Sign in
            </Button>
            <Button href="/login" type="button" id="navbtn" className="btn btn-outline-secondary">
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