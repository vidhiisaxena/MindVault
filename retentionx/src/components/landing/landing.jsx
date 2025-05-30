import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
// import {LoginPage} from "../signup/login";
import "./landing.css"; 
// import {Dashboard} from "../dashboard/Dashboard";
import Feature from "./features";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar className="navbar" >
        <Container>
          {/* <Navbar.Brand>
          <div className="element logo"></div>
          </Navbar.Brand> */}
          <Navbar.Brand className="brand-container">
            <a href="/" className="brand-link">
              <img src=".\images\logo copy.png" className="logo-image" />
              <div className="brand-text">RetentionX</div>
            </a>
            </Navbar.Brand>


          <Nav className="ms-auto">
            <Button href="/Dashboard" type="button" id="navbtn" className="btn btn-outline-secondary">
              Dashboard
            </Button>
            <Button href="/login" type="button" id="navbtn" className="btn btn-outline-secondary">
              Sign in
            </Button>
            <Button href="/login" type="button" id="navbtn" className="btn btn-outline-secondary">
              Sign up
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Floating Icons */}
      <img src={process.env.PUBLIC_URL + "/images/icons/star.png"} className="floating-icon star" alt="star" />
      <img src={process.env.PUBLIC_URL + "/images/icons/bookmark.png"} className="floating-icon bookmark" alt="star" />
      <img src={process.env.PUBLIC_URL + "/images/icons/calender.png"} className="floating-icon calender" alt="star" />
      <img src={process.env.PUBLIC_URL + "/images/icons/copy.png"} className="floating-icon copy" alt="star" />
      
      {/* Hero Section */}
      <Container className="hero-section text-center">
        <h1 className="hero-title">
          <span className="grad-text">Unlock</span> your Potential
        </h1>
        <p className="hero-subtext">
        Say goodbye to forgetting and hello to lasting knowledge.
        </p>
        <Button variant="light" className="cta-button" href="#feature">
          Unleash the Powers of your Mind
        </Button>
      </Container>
      <Feature />

      {/* Student Offer Section (New Section Below Features) */}
      <Container className="student-offer">
        <div>
        <h2 className="student-title">
          <div className="signtext">Boost grade.</div>
          <div className="signtext">Not stress.</div> 
          <div>Free for students.</div>
        </h2>
        <p className="student-subtext">
          <div>Start setting the curve with the most accurate AI.</div>
        </p>
        <Button className="student-btn" href="/login">
          <div>Use RetentionX for free</div>
        </Button>
        </div>
      </Container>

    </div>
  );
}