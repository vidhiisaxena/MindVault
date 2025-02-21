import fitz  # PyMuPDF for extracting text from PDFs
from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
from pydantic import BaseModel
from typing import List
import random
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk import pos_tag

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)  # Ensure upload directory exists

pdf_storage = {}  # Temporary storage for uploaded PDFs
quiz_answers = {}  # Temporary storage for correct answers


class QuizSubmission(BaseModel):
    user_answers: List[str]  # List of user's answers


def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text


def generate_quiz_from_text(text, num_questions=5):
    """Generate quiz questions from extracted text using nltk."""
    sentences = sent_tokenize(text)  # Tokenize into sentences
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]  # Remove short sentences
    quiz_questions = []

    for _ in range(min(num_questions, len(sentences))):
        sentence = random.choice(sentences)
        sentences.remove(sentence)  # Prevent repetition

        words = word_tokenize(sentence)  # Tokenize into words
        tagged_words = pos_tag(words)  # Get part-of-speech tags

        # Extract meaningful words (nouns, verbs, adjectives)
        key_words = [word for word, tag in tagged_words if tag.startswith(('NN', 'VB', 'JJ'))]

        if len(key_words) < 2:  # Ensure we have enough words to create options
            continue

        correct_answer = random.choice(key_words)  # Select a correct answer
        options = random.sample(key_words, min(3, len(key_words)))  # Select other options
        options.append(correct_answer)
        random.shuffle(options)

        # Replace the correct answer with a blank in the sentence
        sentence_with_blank = sentence.replace(correct_answer, "___", 1)

        quiz_questions.append({
            "question": f"Fill in the blank: {sentence_with_blank}",
            "options": options,
            "correct_answer": correct_answer
        })

    return quiz_questions


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    pdf_storage["latest"] = file_path  # Store the latest uploaded file path
    return {"filename": file.filename, "message": "PDF uploaded successfully"}


@app.post("/generate-quiz")
async def generate_quiz():
    if "latest" not in pdf_storage:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

    pdf_path = pdf_storage["latest"]

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(pdf_path)

    # Generate quiz from text
    quiz_questions = generate_quiz_from_text(extracted_text, num_questions=5)

    if not quiz_questions:
        raise HTTPException(status_code=400, detail="Could not generate quiz. Try another PDF.")

    # Store correct answers
    quiz_answers["latest"] = [q["correct_answer"] for q in quiz_questions]

    return {"message": "Quiz generated successfully", "quiz": quiz_questions}


@app.post("/submit-quiz")
async def submit_quiz(submission: QuizSubmission):
    if "latest" not in quiz_answers:
        raise HTTPException(status_code=400, detail="No quiz available for scoring")

    correct_answers = quiz_answers["latest"]

    # Calculate the score
    score = sum(1 for user_ans, correct_ans in zip(submission.user_answers, correct_answers) if user_ans == correct_ans)

    return {"message": "Quiz submitted successfully", "total_score": score, "max_score": len(correct_answers)}


@app.post("/generate-flashcards")
async def generate_flashcards():
    if "latest" not in pdf_storage:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet")

    pdf_path = pdf_storage["latest"]
    # Logic to extract text and generate flashcards from the uploaded PDF
    return {"message": "Flashcards generated successfully", "pdf": str(pdf_path)}


# Remove the auth import to prevent ModuleNotFoundError
from app.routes import auth
app.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
