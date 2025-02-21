import React from "react";
import "./flashcard.css";

const Flashcard = ({ question, answer, flipped, onFlip, onHide }) => {
  return (
    <div className="flashcard-container">
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="front">
          <h5>{question}</h5>
        </div>
        <div className="back">
          <h5>{answer}</h5>
        </div>
      </div>
      {!flipped ? (
        <button className="btn btn-success mt-2" onClick={onFlip}>
          Show Answer
        </button>
      ) : (
        <button className="btn btn-danger mt-2" onClick={onHide}>
          Hide Answer
        </button>
      )}
    </div>
  );
};

export default Flashcard;
