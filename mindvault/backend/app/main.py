from fastapi import FastAPI
from app.routes.flashcards import router as flashcard_router

app = FastAPI()

app.include_router(flashcard_router, prefix="/flashcards")

@app.get("/")
def home():
    return {"message": "Welcome to the Flashcard API"}
