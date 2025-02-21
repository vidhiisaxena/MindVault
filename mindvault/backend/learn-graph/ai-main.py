from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your React URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load JSON data
@app.get("/quiz")
def get_quiz_data():
    with open("quiz-result.json", "r") as file:
        data = json.load(file)
    return data
