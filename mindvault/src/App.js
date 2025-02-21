import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landing/landing";
import LoginPage from "./components/signup/login"; 
import Dashboard from "./components/dashboard/Dashboard";
import FlashcardList from "./components/flashcardlist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login.jsx" element={<LoginPage />} />
        <Route path="/Dashboard.jsx" element={<Dashboard/>}/>
        <Route path="/flashcardlist" element={<FlashcardList />} />
      </Routes>
    </Router>
  );
}

export default App;
