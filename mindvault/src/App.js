import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landing/landing";
import LoginPage from "./components/signup/login"; 
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login.jsx" element={<LoginPage />} />
        <Route path="/Dashboard.jsx" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
