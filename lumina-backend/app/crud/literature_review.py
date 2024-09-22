from typing import List
from sqlalchemy.orm import Session
from app.models.consulting import LiteratureReview
from app.schemas.literature_review import LiteratureReviewCreate, LiteratureReviewUpdate

def create(db: Session, *, obj_in: LiteratureReviewCreate) -> LiteratureReview:
    db_obj = LiteratureReview(**obj_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_multi_by_problem(db: Session, *, problem_id: int) -> List[LiteratureReview]:
    return db.query(LiteratureReview).filter(LiteratureReview.problem_id == problem_id).all()

def get(db: Session, id: int) -> LiteratureReview:
    return db.query(LiteratureReview).filter(LiteratureReview.id == id).first()

def update(db: Session, *, db_obj: LiteratureReview, obj_in: LiteratureReviewUpdate) -> LiteratureReview:
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def remove(db: Session, *, id: int) -> LiteratureReview:
    obj = db.query(LiteratureReview).get(id)
    db.delete(obj)
    db.commit()
    return obj

literature_review = {
    "create": create,
    "get_multi_by_problem": get_multi_by_problem,
    "get": get,
    "update": update,
    "remove": remove
}