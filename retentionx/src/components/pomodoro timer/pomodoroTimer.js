import React, { useState, useEffect } from "react";
import PomodoroCharacter from "./PomodoroCharacter";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PomodoroStyles.css"; // Custom Dark Theme Styles

const PomodoroTimer = () => {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [time, setTime] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState("Focus Time");

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleSessionEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSessionEnd = () => {
    if (session === "Focus Time") {
      setSession("Break Time");
      setTime(breakDuration * 60);
    } else {
      setSession("Focus Time");
      setTime(focusDuration * 60);
    }
    setIsRunning(false);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleSetCustomTimes = () => {
    setIsRunning(false);
    if (session === "Focus Time") {
      setTime(focusDuration * 60);
    } else {
      setTime(breakDuration * 60);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-box">
        <h1 className="session-title">{session}</h1>
        <div className="timer-display">{formatTime(time)}</div>

        {/* Custom Time Inputs */}
        <div className="custom-time-inputs">
          <div className="form-group">
            <label>Focus Time (minutes):</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
            />
          </div>
          <div className="form-group mt-2">
            <label>Break Time (minutes):</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleSetCustomTimes}>
            Set Timer
          </button>
        </div>

        {/* Control Buttons */}
        <div className="button-group mt-3">
          <button className="btn btn-success" onClick={handleStartStop}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button className="btn btn-danger" onClick={handleSessionEnd}>
            Skip
          </button>
        </div>
      </div>

      {/* Character and Quote Section */}
      <PomodoroCharacter session={session} />
    </div>
  );
};

export default PomodoroTimer;
