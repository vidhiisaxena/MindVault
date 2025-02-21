import React from "react";
import "./flashcard.css";

const Flashcard = ({ question, answer, flipped, onFlip }) => {
  return (
    <div className="flashcard" onClick={onFlip}>
      <div className={`card-content ${flipped ? "flipped" : ""}`}>
        {flipped ? answer : question}
      </div>
    </div>
  );
};

export default Flashcard;
