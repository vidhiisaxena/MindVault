from fastapi import FastAPI, File, UploadFile, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import fitz  # PyMuPDF
import os

app = FastAPI()

# ✅ Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["flashcardDB"]  # Database name
flashcards_collection = db["flashcards"]  # Collection name

# ✅ Upload and Extract Flashcards from PDF
@app.post("/upload_pdf/")
async def upload_pdf(user_id: int, file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_text = ""
        
        # Open PDF from binary content
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                pdf_text += page.get_text("text") + "\n"

        # ✅ Process extracted text into flashcards
        flashcards = []
        lines = pdf_text.strip().split("\n")
        for i in range(0, len(lines) - 1, 2):  # Assuming Q&A are consecutive lines
            flashcard = {
                "user_id": user_id,
                "question": lines[i],
                "answer": lines[i + 1],
                "mode": "normal"  # Default mode
            }
            flashcards.append(flashcard)

        # ✅ Store flashcards in MongoDB
        if flashcards:
            await flashcards_collection.insert_many(flashcards)
        
        return {"message": "Flashcards extracted and stored", "flashcards_count": len(flashcards)}

    except Exception as e:
        return {"error": str(e)}

# ✅ Get Flashcards for a User
@app.get("/flashcards/{user_id}")
async def get_flashcards(user_id: int):
    flashcards = await flashcards_collection.find({"user_id": user_id}).to_list(100)
    if not flashcards:
        raise HTTPException(status_code=404, detail="No flashcards found for this user")
    return {"flashcards": flashcards}

# ✅ Quiz Mode: Check User Answer
@app.post("/flashcards/quiz/")
async def check_answer(flashcard_id: str, user_answer: str):
    from bson import ObjectId

    flashcard = await flashcards_collection.find_one({"_id": ObjectId(flashcard_id)})
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    correct = flashcard["answer"].strip().lower() == user_answer.strip().lower()
    return {"correct": correct, "correct_answer": flashcard["answer"]}

from app.routes import auth
app.include_router(auth.auth_router, prefix="/auth", tags=["auth"])


