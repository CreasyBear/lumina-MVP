import logging
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from app import crud
from app.schemas.problem import ProblemBase, ProblemCreate, ProblemUpdate
from app.schemas.literature_review import LiteratureReviewBase, LiteratureReviewCreate, LiteratureReviewUpdate
from app.schemas.analysis import AnalysisResult, AnalysisRequest
from app.api.deps import get_db
from app.ai.multi_step_engine import analyze_problem
from typing import List

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=ProblemBase)
async def create_problem(
    problem: ProblemCreate,
    db: Session = Depends(get_db)
):
    db_problem = crud.problem.create(db, obj_in=problem)
    return db_problem

@router.get("/{problem_id}", response_model=ProblemBase)
async def read_problem(
    problem_id: int,
    db: Session = Depends(get_db)
):
    db_problem = crud.problem.get(db, id=problem_id)
    if db_problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    return db_problem

@router.put("/{problem_id}", response_model=ProblemBase)
async def update_problem(
    problem_id: int,
    problem: ProblemUpdate,
    db: Session = Depends(get_db)
):
    db_problem = crud.problem.get(db, id=problem_id)
    if db_problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    db_problem = crud.problem.update(db, db_obj=db_problem, obj_in=problem)
    return db_problem

@router.delete("/{problem_id}", response_model=ProblemBase)
async def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db)
):
    db_problem = crud.problem.get(db, id=problem_id)
    if db_problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    db_problem = crud.problem.remove(db, id=problem_id)
    return db_problem

@router.post("/{problem_id}/literature_reviews", response_model=LiteratureReviewBase)
async def create_literature_review(
    problem_id: int,
    literature_review: LiteratureReviewCreate,
    db: Session = Depends(get_db)
):
    db_literature_review = crud.literature_review.create(db, obj_in=literature_review)
    return db_literature_review

@router.get("/{problem_id}/literature_reviews", response_model=List[LiteratureReviewBase])
async def read_literature_reviews(
    problem_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    db_literature_reviews = crud.literature_review.get_multi_by_problem(
        db, problem_id=problem_id, skip=skip, limit=limit
    )
    return db_literature_reviews

@router.put("/{problem_id}/literature_reviews/{literature_review_id}", response_model=LiteratureReviewBase)
async def update_literature_review(
    problem_id: int,
    literature_review_id: int,
    literature_review: LiteratureReviewUpdate,
    db: Session = Depends(get_db)
):
    db_literature_review = crud.literature_review.get(db, id=literature_review_id)
    if db_literature_review is None or db_literature_review.problem_id != problem_id:
        raise HTTPException(status_code=404, detail="Literature review not found for this problem")
    db_literature_review = crud.literature_review.update(db, db_obj=db_literature_review, obj_in=literature_review)
    return db_literature_review

@router.delete("/{problem_id}/literature_reviews/{literature_review_id}", response_model=LiteratureReviewBase)
async def delete_literature_review(
    problem_id: int,
    literature_review_id: int,
    db: Session = Depends(get_db)
):
    db_literature_review = crud.literature_review.get(db, id=literature_review_id)
    if db_literature_review is None:
        raise HTTPException(status_code=404, detail="Literature review not found")
    db_literature_review = crud.literature_review.remove(db, id=literature_review_id)
    return db_literature_review

@router.post("/{problem_id}/analyze", response_model=AnalysisResult)
async def analyze_problem(
    problem_id: int,
    analysis_request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    db_problem = crud.problem.get(db, id=problem_id)
    if db_problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        result = await analyze_problem(db_problem, analysis_request.query)
        logger.info(f"Analysis completed for problem {problem_id}")
        return result
    except Exception as e:
        logger.error(f"Error during analysis of problem {problem_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during analysis")