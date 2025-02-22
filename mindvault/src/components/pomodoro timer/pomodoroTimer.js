import React, { useState, useEffect } from "react";
import "./pomodoroTimer.css";

const DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function PomodoroTimer() {
  const [mode, setMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.pomodoro);
  const [cycleCount, setCycleCount] = useState(1);
  const [timerActive, setTimerActive] = useState(false);

  // Whenever mode changes, reset the timer to the new duration
  useEffect(() => {
    setTimeLeft(DURATIONS[mode]);
  }, [mode]);

  // Main timer effect
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      handleSessionEnd();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // What happens when a session finishes or is skipped
  const handleSessionEnd = () => {
    if (mode === "pomodoro") {
      // Increment cycle count after a pomodoro
      setCycleCount((prev) => prev + 1);
      // Every 4 pomodoros, go to long break
      if (cycleCount % 4 === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      // If we were on a break, switch back to pomodoro
      setMode("pomodoro");
    }
    setTimerActive(false);
  };

  const handleSkip = () => {
    handleSessionEnd();
  };

  const handleStartPause = () => {
    setTimerActive((prev) => !prev);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimerActive(false);
  };

  // Utility to format seconds as mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className="pomofocus-container">
      <nav className="navbar">
        <div className="nav-left">Pomodoro Timer</div>
        <div className="nav-right">
          <button>Report</button>
          <button>Setting</button>
          <button>Sign In</button>
        </div>
      </nav>

      <div className="timer-card">
        <div className="mode-tabs">
          <button
            className={mode === "pomodoro" ? "active" : ""}
            onClick={() => handleModeChange("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            className={mode === "shortBreak" ? "active" : ""}
            onClick={() => handleModeChange("shortBreak")}
          >
            Short Break
          </button>
          <button
            className={mode === "longBreak" ? "active" : ""}
            onClick={() => handleModeChange("longBreak")}
          >
            Long Break
          </button>
        </div>

        <div className="time-display">{formatTime(timeLeft)}</div>

        <div className="controls">
          <button className="start-pause-btn" onClick={handleStartPause}>
            {timerActive ? "PAUSE" : "START"}
          </button>
          <button className="skip-btn" onClick={handleSkip}>
            SKIP
          </button>
        </div>
      </div>

      <div className="session-info">
        #{cycleCount} {mode === "pomodoro" ? "Time to focus!" : "Break time!"}
      </div>
    </div>
  );
}

export default PomodoroTimer;
