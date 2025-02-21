import React, { useState } from "react";
import Flashcard from "./flashcard";
import "./flashcardlist.css";
import "bootstrap/dist/css/bootstrap.min.css";

const FlashcardList = () => {
  const cards = [
    { question: "What is React?", answer: "A JavaScript library for building UI" },
    { question: "What is JSX?", answer: "A syntax extension for JavaScript" },
    { question: "What is Bootstrap?", answer: "A CSS framework for responsive design" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(true);
  const handleHide = () => setFlipped(false);

  const handleNext = () => {
    setFlipped(false); // Reset flip state
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length); // Move to the next card
  };

  return (
    <div className="flashcard-list">
      <Flashcard 
        question={cards[currentIndex].question} 
        answer={cards[currentIndex].answer} 
        flipped={flipped}
        onFlip={handleFlip}
        onHide={handleHide}
      />
      <button id="nextq" className="btn btn-primary mt-3" onClick={handleNext}>
        Next Question
      </button>
    </div>
  );
};

export default FlashcardList;
