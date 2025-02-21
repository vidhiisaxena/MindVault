from fastapi import APIRouter, HTTPException
from app.database import flashcards_collection
from app.models import Flashcard
from app.services import schedule_next_review
from datetime import datetime

router = APIRouter()

@router.post("/")
async def create_flashcard(flashcard: Flashcard):
    new_flashcard = await flashcards_collection.insert_one(flashcard.dict())
    return {"message": "Flashcard created", "id": str(new_flashcard.inserted_id)}

@router.get("/{user_id}")
async def get_flashcards(user_id: str):
    flashcards = await flashcards_collection.find({"user_id": user_id}).to_list(100)
    return flashcards

@router.put("/{flashcard_id}/review")
async def review_flashcard(flashcard_id: str, difficulty: str):
    flashcard = await flashcards_collection.find_one({"_id": flashcard_id})
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    next_review = schedule_next_review(datetime.utcnow(), difficulty)
    await flashcards_collection.update_one(
        {"_id": flashcard_id},
        {"$set": {"next_review": next_review}}
    )
    return {"message": "Updated next review date", "next_review": next_review}
