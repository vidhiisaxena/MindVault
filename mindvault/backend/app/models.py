from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Flashcard(BaseModel):
    user_id: str
    topic: str
    question: str
    answer: str
    difficulty: str  # "Easy", "Medium", "Hard"
    next_review: Optional[datetime] = None
