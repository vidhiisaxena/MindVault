import React from "react";
import "./progress.css"; // Import the CSS file

const Progress = () => {
  return (
    <div className="progress-container">
      {/* Left Section: Graph & Stats */}
      <div className="left-section">
        <h2 className="title">AI-Predicted Forgetting Graph</h2>
        <div className="graph-placeholder">[Graph Placeholder]</div>

        <div className="stats-container">
          <div className="stat-box">
            <p className="stat-label">Tasks Completed</p>
            <p className="stat-value">85</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Average Focus Time</p>
            <p className="stat-value">5h 32m</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Efficiency Score</p>
            <p className="stat-value">92%</p>
          </div>
        </div>
      </div>

      {/* Right Section: Suggested Questions */}
      <div className="right-section">
        <h3 className="sub-title">Suggested Questions</h3>
        <ul className="suggestions">
          <li>🔹 How can I optimize my daily workflow?</li>
          <li>🔹 What distractions can I minimize?</li>
          <li>🔹 How can I improve my focus time?</li>
        </ul>
      </div>
    </div>
  );
};

export default Progress;
