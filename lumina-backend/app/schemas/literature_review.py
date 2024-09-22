from pydantic import BaseModel
from typing import Optional

class LiteratureReviewBase(BaseModel):
    title: str
    content: str
    source: str
    problem_id: int

class LiteratureReviewCreate(LiteratureReviewBase):
    pass

class LiteratureReviewUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = None
    problem_id: Optional[int] = None

class LiteratureReview(LiteratureReviewBase):
    id: int

    class Config:
        orm_mode = True