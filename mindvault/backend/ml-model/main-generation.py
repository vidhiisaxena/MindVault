from fastapi import FastAPI
from model import generate_flashcard, question_generator
from pydantic import BaseModel

app = FastAPI()

class QuizRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.post("/generate-quiz")
def generate_quiz(data: QuizRequest):
    questions = question_generator(data.text)
    return {"questions": questions}

@app.post("/generate-flashcard")
def generate_flashcard_api(data: QuizRequest):
    flashcard = generate_flashcard(data.text)
    return {"flashcard": flashcard}

@app.get("/generate-quiz")
def generate_quiz():
    return {"quiz": "This is a sample quiz"}


# Run FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
