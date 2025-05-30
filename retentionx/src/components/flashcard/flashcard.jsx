import React from "react";
import "./flashcard.css";

const Flashcard = ({ flashcard, flipped, onFlip }) => {
    if (!flashcard || (!flashcard.question && !flashcard.answer)) {
        return <div className="flashcard">Invalid flashcard data</div>;
    }

    return (
        <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={onFlip}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <h3>{flashcard.question}</h3>
                </div>
                <div className="flashcard-back">
                    <p>{flashcard.answer}</p>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
