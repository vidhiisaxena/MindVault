import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landing/landing";
import LoginPage from "./components/signup/login"; 
import Dashboard from "./components/dashboard/Dashboard";
import FlashcardList from "./components/flashcard/flashcardlist";
import Quiz from "./components/quiz/Quiz";
import { useEffect } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/flashcardlist" element={<FlashcardList />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
