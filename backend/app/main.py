import fitz  # PyMuPDF for extracting text from PDFs
from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
from pydantic import BaseModel
from typing import List
import google.generativeai as genai  # Gemini API
import os
import random
import datetime
from enum import Enum
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from app.utils import extract_text_from_pdf, extract_video_id
from dotenv import load_dotenv

# ✅ Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent  # Moves up from 'app' to 'backend'
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# ✅ Retrieve the Gemini API key
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise ValueError("Gemini API key is missing! Set GEMINI_API_KEY in your .env file or environment.")

# ✅ Set up Gemini API
genai.configure(api_key=gemini_api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure upload directory exists

pdf_storage = {}  # Store uploaded PDFs
quiz_questions_db = {}  # Store MCQs
flashcards_db = {}  # Store flashcards


class DifficultyLevel(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"


# from pdf2image import convert_from_path
# import pytesseract

# def extract_text_with_ocr(pdf_path):
#     doc = fitz.open(pdf_path)
#     text = ""
#     for i, page in enumerate(doc):
#         pix = page.get_pixmap(dpi=300)
#         image_path = f"page_{i+1}.png"
#         pix.save(image_path)

#         ocr_text = pytesseract.image_to_string(image_path)
#         print(f"[OCR] Page {i+1} text: {ocr_text[:100]}...")
#         text += ocr_text + "\n"

#         os.remove(image_path)  # Clean up temp image file

#     return text
 # Utility functions

# Unified content generation function (Handles both PDF and YouTube)
def generate_notes_from_youtube(video_url: str):
    video_id = extract_video_id(video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL.")

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([entry["text"] for entry in transcript])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transcript: {str(e)}")

    model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
    prompt = f"Summarize the following transcript into concise key notes:\n\n{transcript_text}"
    
    response = model.generate_content(prompt)
    return response.text.strip() if response.text else ""

@app.post("/generate-content")
async def generate_content(file: UploadFile = None, link: str = None):
    if file:
        pdf_path = Path(f"uploads/{file.filename}")
        with pdf_path.open("wb") as buffer:
            buffer.write(file.file.read())

        extracted_text = extract_text_from_pdf(pdf_path)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text found in the uploaded PDF.")

    elif link:
        extracted_text = generate_notes_from_youtube(link)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Failed to extract notes from YouTube video.")
    else:
        raise HTTPException(status_code=400, detail="Either file or link must be provided.")

    # Decide between quiz or flashcards
    is_flashcard = (file and file.filename.endswith(".pdf")) or ("flashcard" in (link or "").lower())

    if is_flashcard:
        flashcards = generate_flashcards_from_text(extracted_text)
        return {"flashcards": flashcards}
    else:
        quiz = generate_mcqs_from_text(extracted_text)
        return {"questions": quiz}


def call_gemini_for_flashcards(text, num_flashcards=5):
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    prompt = f"""Generate {num_flashcards} simple flashcards from the following text:
    
{text}

Each flashcard should be in the format:
Q: <question or prompt>
A: <answer or explanation>

Output only the flashcards, separated by double newlines.
"""
    response = model.generate_content(prompt)
    return response.text

def call_gemini_for_mcqs(text, num_questions):
    """Use Gemini to generate MCQs from extracted text."""
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    prompt = f"Generate {num_questions} multiple-choice questions (MCQs) based on the following content:\n\n{text}\n\nEach question should have 4 options and one correct answer. Format:\n\nQ: <question>\nA) <option 1>\nB) <option 2>\nC) <option 3>\nD) <option 4>\nAnswer: <correct option letter>"

    response = model.generate_content(prompt)
    return response.text


def generate_mcqs_from_text(text, num_questions=5):
    print(f"Generating MCQs from text: {text[:200]}...")  # Print first 200 chars
    if not text.strip():
        print("❌ No text found in the PDF!")
        return []

    # Call Gemini API
    questions = call_gemini_for_mcqs(text, num_questions)
    
    print(f"✅ Generated Questions: {questions}")
    return questions


def generate_flashcards_from_text(text, num_flashcards=5):
    print(f"[DEBUG] Calling Gemini for {num_flashcards} flashcards...")
    if not text.strip():
        print("❌ No text found in the PDF!")
        return []

    response = call_gemini_for_flashcards(text, num_flashcards)
    print(f"[DEBUG] Gemini raw response:\n{response}\n")  # Add this line to inspect format

    flashcards = []
    existing_count = len(flashcards_db.get("latest", []))

    blocks = response.strip().split("\n\n")  # Separate by paragraph
    for i, block in enumerate(blocks):
        if "Q:" in block and "A:" in block:
            lines = block.strip().split("\n")
            question = lines[0].replace("Q:", "").strip()
            answer = lines[1].replace("A:", "").strip()
            flashcards.append({
                "id": existing_count + i + 1,
                "question": question,
                "answer": answer,
                "next_review": None,
                "easiness_streak": 0
            })

    return flashcards



@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    pdf_storage["latest"] = file_path
    return {"filename": file.filename, "message": "PDF uploaded successfully"}


@app.post("/generate-quiz")
async def generate_quiz():
    if "latest" not in pdf_storage:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

    pdf_path = pdf_storage["latest"]
    extracted_text = extract_text_from_pdf(pdf_path)

    # Generate MCQs
    raw_mcqs = generate_mcqs_from_text(extracted_text, num_questions=5)

    if not raw_mcqs:
        raise HTTPException(status_code=500, detail="Failed to generate MCQs")

    # ✅ Ensure MCQs are stored properly
    formatted_mcqs = []
    questions = raw_mcqs.strip().split("\n\n")  # Split based on paragraph breaks

    for q in questions:
        if "Q:" in q and "Answer:" in q:
            parts = q.split("\n")
            question_text = parts[0].replace("Q: ", "").strip()
            options = [opt.strip() for opt in parts[1:5]]  # Extract A, B, C, D
            correct_answer = parts[-1].replace("Answer: ", "").strip()

            formatted_mcqs.append({
                "question": question_text,
                "options": options,
                "answer": correct_answer
            })

    quiz_questions_db["latest"] = formatted_mcqs  # ✅ Store as structured data

    return {
        "message": "MCQs generated successfully",
        "questions": quiz_questions_db["latest"]
    }


@app.get("/get-quiz")
async def get_quiz():
    if "latest" not in quiz_questions_db:
        return {"questions": []}

    return {"questions": quiz_questions_db["latest"]}


@app.post("/generate-flashcards")
async def generate_flashcards():
    if "latest" not in pdf_storage:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

    pdf_path = pdf_storage["latest"]
    extracted_text = extract_text_from_pdf(pdf_path)
    new_flashcards = generate_flashcards_from_text(extracted_text, num_flashcards=5)

    if "latest" not in flashcards_db:
        flashcards_db["latest"] = new_flashcards
    else:
        flashcards_db["latest"].extend(new_flashcards)

    return {"message": "Flashcards generated successfully", "flashcards": flashcards_db["latest"]}


@app.get("/get-flashcards")
async def get_flashcards():
    if "latest" not in flashcards_db:
        return {"flashcards": []}

    return {"flashcards": flashcards_db["latest"]}


class FlashcardRating(BaseModel):
    flashcard_id: int
    difficulty: DifficultyLevel


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

from app.routes import youtube
app.include_router(youtube.router, prefix="/youtube", tags=["youtube"])
