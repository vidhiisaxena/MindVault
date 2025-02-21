import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./flashcardlist.css";
import Flashcard from "./flashcard";

const FlashcardList = () => {
  const cards = [
    { question: "What is React?", answer: "A JavaScript library for building UI" },
    { question: "What is JSX?", answer: "A syntax extension for JavaScript" },
    { question: "What is Bootstrap?", answer: "A CSS framework for responsive design" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => {
    setFlipped(false);
    setDifficulty(null);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };
  const handleFlag = (level) => {
    setDifficulty(level);
    console.log(`Card flagged as: ${level}`);
  };

  return (
    <div className="flashcard-container">
      <Flashcard 
        question={cards[currentIndex].question} 
        answer={cards[currentIndex].answer} 
        flipped={flipped}
        onFlip={handleFlip}
      />
      <div className="buttons-container">
        <button
          className={`flag-button ${difficulty === "Easy" ? "easy" : ""}`}
          onClick={() => handleFlag("Easy")}
        >
          Easy
        </button>
        <button
          className={`flag-button ${difficulty === "Medium" ? "medium" : ""}`}
          onClick={() => handleFlag("Medium")}
        >
          Medium
        </button>
        <button
          className={`flag-button ${difficulty === "Hard" ? "hard" : ""}`}
          onClick={() => handleFlag("Hard")}
        >
          Hard
        </button>
      </div>
      <button className="next-button" onClick={handleNext}>Next</button>
    </div>
  );
};

export default FlashcardList;
