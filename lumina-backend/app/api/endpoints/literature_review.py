from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud
from app.api import deps
from app.schemas.literature_review import LiteratureReview, LiteratureReviewCreate, LiteratureReviewUpdate

router = APIRouter()

@router.post("/", response_model=LiteratureReview)
def create_literature_review(
    *,
    db: Session = Depends(deps.get_db),
    literature_review_in: LiteratureReviewCreate,
) -> Any:
    """
    Create new literature review.
    """
    literature_review = crud.literature_review.create(db=db, obj_in=literature_review_in)
    return literature_review

@router.get("/{literature_review_id}", response_model=LiteratureReview)
def read_literature_review(
    literature_review_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get literature review by ID.
    """
    literature_review = crud.literature_review.get(db=db, id=literature_review_id)
    if literature_review is None:
        raise HTTPException(status_code=404, detail="Literature review not found")
    return literature_review

@router.get("/", response_model=List[LiteratureReview])
def read_literature_reviews(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve literature reviews.
    """
    literature_reviews = crud.literature_review.get_multi(db, skip=skip, limit=limit)
    return literature_reviews

@router.put("/{literature_review_id}", response_model=LiteratureReview)
def update_literature_review(
    *,
    db: Session = Depends(deps.get_db),
    literature_review_id: int,
    literature_review_in: LiteratureReviewUpdate,
) -> Any:
    """
    Update a literature review.
    """
    literature_review = crud.literature_review.get(db=db, id=literature_review_id)
    if literature_review is None:
        raise HTTPException(status_code=404, detail="Literature review not found")
    literature_review = crud.literature_review.update(db=db, db_obj=literature_review, obj_in=literature_review_in)
    return literature_review

@router.delete("/{literature_review_id}", response_model=LiteratureReview)
def delete_literature_review(
    *,
    db: Session = Depends(deps.get_db),
    literature_review_id: int,
) -> Any:
    """
    Delete a literature review.
    """
    literature_review = crud.literature_review.get(db=db, id=literature_review_id)
    if literature_review is None:
        raise HTTPException(status_code=404, detail="Literature review not found")
    literature_review = crud.literature_review.remove(db=db, id=literature_review_id)
    return literature_review