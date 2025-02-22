import fitz  # PyMuPDF for extracting text from PDFs
from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
from pydantic import BaseModel
from typing import List, Dict
import random
import datetime
from enum import Enum

# ✅ Define difficulty levels using Enum
class DifficultyLevel(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust based on frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure upload directory exists

pdf_storage = {}  # Temporary storage for uploaded PDFs
flashcards_db = {}  # Store flashcards with review schedules


def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file."""
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text


def generate_flashcards_from_text(text, num_flashcards=5):
    """Generate flashcards from extracted text."""
    sentences = text.split(". ")
    flashcards = []

    for _ in range(min(num_flashcards, len(sentences))):
        sentence = random.choice(sentences)
        sentences.remove(sentence)
        flashcards.append({
            "id": len(flashcards) + 1,
            "content": sentence.strip(),
            "next_review": None,
            "easiness_streak": 0
        })
    
    return flashcards


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    pdf_storage["latest"] = file_path  # Store the latest uploaded file path
    return {"filename": file.filename, "message": "PDF uploaded successfully"}


@app.post("/generate-flashcards")
async def generate_flashcards():
    if "latest" not in pdf_storage:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

    pdf_path = pdf_storage["latest"]
    extracted_text = extract_text_from_pdf(pdf_path)
    flashcards = generate_flashcards_from_text(extracted_text, num_flashcards=5)
    
    flashcards_db["latest"] = flashcards
    return {"message": "Flashcards generated successfully", "flashcards": flashcards}


# ✅ Define Flashcard Rating Model Properly
class FlashcardRating(BaseModel):
    flashcard_id: int
    difficulty: DifficultyLevel  # Ensure the Enum is used correctly


@app.post("/rate-flashcard")
async def rate_flashcard(rating: FlashcardRating):
    if "latest" not in flashcards_db:
        raise HTTPException(status_code=400, detail="No flashcards available")

    flashcards = flashcards_db["latest"]
    flashcard = next((fc for fc in flashcards if fc["id"] == rating.flashcard_id), None)

    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    today = datetime.date.today()

    if rating.difficulty == DifficultyLevel.easy:
        flashcard["easiness_streak"] += 1
        flashcard["next_review"] = today + datetime.timedelta(days=30) if flashcard["easiness_streak"] >= 2 else today + datetime.timedelta(days=7)
    elif rating.difficulty == DifficultyLevel.medium:
        flashcard["next_review"] = today + datetime.timedelta(days=5)
    elif rating.difficulty == DifficultyLevel.hard:
        flashcard["next_review"] = today + datetime.timedelta(days=2)

    return {"message": "Flashcard rating updated", "next_review": flashcard["next_review"].isoformat()}

# # Remove the auth import to prevent ModuleNotFoundError
from app.routes import auth
app.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
