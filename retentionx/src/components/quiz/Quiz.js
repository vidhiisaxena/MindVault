import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../sidebar/sidebar";
import Score from "./Components/Score";
import "./Quiz.css";

const Quiz = () => {
  const [questionBank, setQuestionBank] = useState([]); // Start with empty array
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://devcation.onrender.com/generate-quiz");
        const data = await response.json();
        console.log("Fetched questions:", data); // Debugging log
        setQuestionBank(data.questions || []); // Extracting the array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, []);
  
  if (loading) {
    return <h2>Loading questions...</h2>; // Prevents error before data loads
  }

  if (!questionBank.length) {
    return <h2>No questions available</h2>; // Handles empty API response
  }

  // Ensure the current question is valid before accessing properties
  const currentQ = questionBank[currentQuestion];
  if (!currentQ) {
    return <h2>Error: Question not found</h2>; // Prevents crash if index is out of bounds
  }

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    checkAnswer();
    handleNextQuestion();
  };

  const checkAnswer = () => {
    if (selectedOption.trim().charAt(0) === currentQ.answer.trim()) {
      setScore((prevScore) => prevScore + 1);
    }
  };  

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questionBank.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption("");
    } else {
      setQuizEnd(true);
    }
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <div className="quiz-container d-flex flex-column align-items-center justify-content-center">
      <Sidebar />
      {!quizEnd ? (
        <div className="question-container">
          <h2 className="question-text">{currentQ.question}</h2>
          <form onSubmit={handleFormSubmit} className="quiz-options">
            {currentQ.options.map((option, index) => (
              <label key={index} className="quiz-option">
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                {option}
              </label>
            ))}
            <div className="difficulty-buttons">
              <button type="button" className={`flag-button easy ${selectedDifficulty === "easy" ? "selected" : ""}`} onClick={() => handleDifficultyClick("easy")}>
                Easy
              </button>
              <button type="button" className={`flag-button medium ${selectedDifficulty === "medium" ? "selected" : ""}`} onClick={() => handleDifficultyClick("medium")}>
                Medium
              </button>
              <button type="button" className={`flag-button hard ${selectedDifficulty === "hard" ? "selected" : ""}`} onClick={() => handleDifficultyClick("hard")}>
                Difficult
              </button>
            </div>
            <button type="submit" className="quiz-btn">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <Score score={score} />
      )}
    </div>
  );
};

export default Quiz;
