import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./flashcardlist.css";
import Flashcard from "./flashcard";
import Sidebar from "../sidebar/sidebar";

const FlashcardList = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  // Fetch flashcards from FastAPI backend
  useEffect(() => {
    fetch("http://localhost:8000/generate-flashcards", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.flashcards) {
          setCards(data.flashcards);
        }
      })
      .catch((err) => console.error("Error fetching flashcards:", err));
  }, []);

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setFlipped(false);
    setDifficulty(null);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handleFlag = async (level) => {
    setDifficulty(level);
    if (cards.length > 0) {
      const flashcardId = cards[currentIndex].id;

      try {
        const response = await fetch("http://localhost:8000/rate-flashcard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flashcard_id: flashcardId, difficulty: level }),
        });

        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("Error rating flashcard:", error);
      }
    }
  };

  return (
    <div className="flashcard-container">
      <Sidebar />
      {cards.length > 0 ? (
        <Flashcard 
          question={cards[currentIndex].content} 
          answer="(Answer not available in backend response)" 
          flipped={flipped}
          onFlip={handleFlip}
        />
      ) : (
        <p>Loading flashcards...</p>
      )}

      <div className="buttons-container">
        <button className={`flag-button ${difficulty === "Easy" ? "easy" : ""}`} onClick={() => handleFlag("Easy")}>
          Easy
        </button>
        <button className={`flag-button ${difficulty === "Medium" ? "medium" : ""}`} onClick={() => handleFlag("Medium")}>
          Medium
        </button>
        <button className={`flag-button ${difficulty === "Hard" ? "hard" : ""}`} onClick={() => handleFlag("Hard")}>
          Hard
        </button>
      </div>
      <button className="next-button" onClick={handleNext}>Next</button>
    </div>
  );
};

export default FlashcardList;
