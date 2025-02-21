import random
import os
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.database import flashcards_collection
from app.pdf_extractor import extract_text_from_pdf
from bson import ObjectId

router = APIRouter()

@router.post("/upload/")
async def upload_pdf(user_id: int, file: UploadFile = File(...)):
    content = await file.read()
    pdf_path = f"temp_{user_id}.pdf"
    
    with open(pdf_path, "wb") as f:
        f.write(content)

    extracted_text = extract_text_from_pdf(pdf_path)
    os.remove(pdf_path)  # ✅ Cleanup file

    questions = extracted_text.split("\n")

    flashcards = []
    for i in range(0, len(questions) - 1, 2):  
        question = questions[i]
        correct_answer = questions[i + 1] if i + 1 < len(questions) else "N/A"

        # ✅ Generate 3 wrong options randomly from other answers
        all_answers = [questions[j] for j in range(1, len(questions), 2) if j != i + 1]
        wrong_options = random.sample(all_answers, min(3, len(all_answers)))

        options = wrong_options + [correct_answer]  # 3 wrong + 1 correct
        random.shuffle(options)  # Shuffle for randomness

        flashcard = {
            "user_id": user_id,
            "topic": "Extracted",
            "question": question,
            "options": options,
            "correct_option_index": options.index(correct_answer),  # ✅ Store correct index
            "difficulty": "Medium",
            "mode": "mcq",
            "next_review": None
        }
        flashcards.append(flashcard)
    
    await flashcards_collection.insert_many(flashcards)
    return {"message": "MCQ Flashcards extracted and stored", "count": len(flashcards)}
