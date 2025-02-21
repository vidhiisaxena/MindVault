from fastapi import APIRouter, HTTPException, UploadFile, File
from app.database import flashcards_collection
from app.models import Flashcard
from app.pdf_extractor import extract_text_from_pdf
from bson import ObjectId
from datetime import datetime
import asyncio

router = APIRouter()

# ✅ Upload a PDF and extract flashcards
@router.post("/upload/")
async def upload_pdf(user_id: int, file: UploadFile = File(...)):
    content = await file.read()
    pdf_path = f"temp_{user_id}.pdf"
    
    with open(pdf_path, "wb") as f:
        f.write(content)

    extracted_text = extract_text_from_pdf(pdf_path)
    questions = extracted_text.split("\n")  # Simple split; refine as needed

    flashcards = []
    for i in range(0, len(questions) - 1, 2):  # Assuming Q/A pairs
        flashcard = {
            "user_id": user_id,
            "topic": "Extracted",
            "question": questions[i],
            "answer": questions[i + 1] if i + 1 < len(questions) else "N/A",
            "difficulty": "Medium",
            "mode": "normal",
            "next_review": None
        }
        flashcards.append(flashcard)
    
    await flashcards_collection.insert_many(flashcards)
    return {"message": "Flashcards extracted and stored", "count": len(flashcards)}

# ✅ Get Flashcards for a User
@router.get("/{user_id}")
async def get_flashcards(user_id: int):
    flashcards = await flashcards_collection.find({"user_id": user_id}).to_list(100)
    return {"flashcards": flashcards}

# ✅ Quiz Mode: Check User Answer
@router.post("/quiz/")
async def check_answer(flashcard_id: str, user_answer: str):
    flashcard = await flashcards_collection.find_one({"_id": ObjectId(flashcard_id)})

    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    correct = flashcard["answer"].strip().lower() == user_answer.strip().lower()
    return {"correct": correct, "correct_answer": flashcard["answer"]}
