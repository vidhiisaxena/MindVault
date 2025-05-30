import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./flashcardlist.css";
import Flashcard from "./flashcard";
import Sidebar from "../sidebar/sidebar";
import { rateFlashcard } from "../../api";

const formatReviewDate = (dateStr) => {
    if (!dateStr) return "Not scheduled";
    const date = new Date(dateStr);
    return date.toLocaleString(); // Format: "4/14/2025, 7:00:00 PM"
};

const FlashcardList = () => {
    const [localFlashcards, setLocalFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const [error, setError] = useState(null);

    // <Button onClick={() => {
    //     const updatedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    //     setLocalFlashcards(updatedFlashcards);
    //     setCurrentIndex(0);
    //     setFlipped(false);
    // }}>
    //     🔄 Reload Flashcards
    // </Button>

    useEffect(() => {
        const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
        if (storedFlashcards.length > 0) {
            setLocalFlashcards(storedFlashcards);
        }
    }, []);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNext = () => {
        setFlipped(false);
        setDifficulty(null);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % localFlashcards.length);
    };

    const handleFlag = async (level) => {
        if (localFlashcards.length === 0 || !localFlashcards[currentIndex]) {
            console.error("No flashcards available or currentIndex is out of bounds.");
            return;
        }

        setDifficulty(level);
        const flashcardId = localFlashcards[currentIndex].id;

        try {
            const response = await rateFlashcard(flashcardId, level);
            const updatedCards = localFlashcards.map((card) =>
                card.id === flashcardId ? { ...card, next_review: response.data.next_review } : card
            );
            setLocalFlashcards(updatedCards);
            localStorage.setItem("flashcards", JSON.stringify(updatedCards)); // ✅ Add this line

            alert(`Next review scheduled: ${response.data.next_review}`);
        } catch (error) {
            console.error("Error rating flashcard:", error);
            setError("Failed to update flashcard difficulty.");
        }
    };

    if (!localFlashcards || localFlashcards.length === 0) {
        return (
            <div className="flashcard-container">
                <Sidebar />
                <p>No flashcards available.</p>
            </div>
        );
    }

    return (
        <div className="flashcard-container">
            <Sidebar />
            <Flashcard
                flashcard={localFlashcards[currentIndex]}
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

            <p>Next Review: {formatReviewDate(localFlashcards[currentIndex].next_review)}</p>
            <button className="next-button" onClick={handleNext}>
                Next
            </button>

            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
   
    
};

export default FlashcardList;
