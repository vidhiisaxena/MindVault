let timeLeft = 1500; // Default 25 minutes
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const skipButton = document.getElementById("skip");
const setTimeButton = document.getElementById("set-time");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Time's up! Take a break.");
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  setCustomTime(); // Reset to custom inputs
  updateTimerDisplay();
}

function setCustomTime() {
  const minutes = parseInt(minutesInput.value, 10) || 0;
  const seconds = parseInt(secondsInput.value, 10) || 0;
  timeLeft = minutes * 60 + seconds;
}

setTimeButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  setCustomTime();
  updateTimerDisplay();
});

startButton.addEventListener("click", startTimer);
skipButton.addEventListener("click", resetTimer);

// Initialize
updateTimerDisplay();
