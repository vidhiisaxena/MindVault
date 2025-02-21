import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landing/landing";
import LoginPage from "./components/signup/login"; 
import Dashboard from "./components/dashboard/Dashboard";
import FlashcardList from "./components/flashcardlist";
import { useEffect } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/flashcardlist" element={<FlashcardList />} />
      </Routes>
    </Router>
  );

{/* <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
<script src="https://files.bpcontent.cloud/2025/02/21/17/20250221173635-6DOLLHY3.js"></script> */}
    
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.src =
      "https://files.bpcontent.cloud/2025/02/21/17/20250221173635-6DOLLHY3.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return (
    <div>
      <h1>Welcome to My Website</h1>
      {/* Your website content */}
    </div>
  );
}

export default App;