from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class Flashcard(BaseModel):
    user_id: int  # Changed from str to int
    topic: str
    question: str
    answer: str
    difficulty: str  # "Easy", "Medium", "Hard"
    mode: str  # "normal" or "quiz"
    next_review: Optional[str] = None  # Can be a date string

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str  # Fixed incorrect syntax

class UserInDB(UserSignup):
    hashed_password: str  # Store hashed passwords

