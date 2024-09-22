import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.consulting import Problem, LiteratureReview
from tests.conftest import LiteratureReviewCreate  # Import the minimal schema
from app.db.base import Base
from app.auth.auth import get_current_user  # Import get_current_user

@pytest.fixture(autouse=True)
def setup_db(db: Session):
    Base.metadata.create_all(bind=db.bind)
    yield
    Base.metadata.drop_all(bind=db.bind)

def test_create_literature_review(client: TestClient, db: Session):
    # Create a test problem
    problem = Problem(title="Test Problem", description="Test Description", client="Test Client", status="New")
    db.add(problem)
    db.commit()

    review_data = {
        "problem_id": problem.id,
        "title": "Test Literature Review",
        "content": "This is a test literature review content.",
        "source": "Test Source"
    }
    response = client.post("/api/v1/literature-reviews/", json=review_data)
    assert response.status_code == 200
    created_review = response.json()
    assert created_review["title"] == review_data["title"]
    assert created_review["content"] == review_data["content"]
    assert created_review["source"] == review_data["source"]

def test_read_literature_reviews(client: TestClient, db: Session):
    # Create a test problem and literature review
    problem = Problem(title="Test Problem", description="Test Description", client="Test Client", status="New")
    db.add(problem)
    db.commit()

    review = LiteratureReview(problem_id=problem.id, title="Test Review", content="Test Content", source="Test Source")
    db.add(review)
    db.commit()

    response = client.get(f"/api/v1/literature-reviews/{problem.id}")
    assert response.status_code == 200
    reviews = response.json()
    assert len(reviews) == 1
    assert reviews[0]["title"] == "Test Review"

def test_update_literature_review(client: TestClient, db: Session):
    # Create a test problem and literature review
    problem = Problem(title="Test Problem", description="Test Description", client="Test Client", status="New")
    db.add(problem)
    db.commit()

    review = LiteratureReview(problem_id=problem.id, title="Test Review", content="Test Content", source="Test Source")
    db.add(review)
    db.commit()

    update_data = {
        "title": "Updated Test Review",
        "content": "Updated Test Content",
        "source": "Updated Test Source"
    }
    response = client.put(f"/api/v1/literature-reviews/{review.id}", json=update_data)
    assert response.status_code == 200
    updated_review = response.json()
    assert updated_review["title"] == update_data["title"]
    assert updated_review["content"] == update_data["content"]
    assert updated_review["source"] == update_data["source"]

def test_delete_literature_review(client: TestClient, db: Session):
    # Create a test problem and literature review
    problem = Problem(title="Test Problem", description="Test Description", client="Test Client", status="New")
    db.add(problem)
    db.commit()

    review = LiteratureReview(problem_id=problem.id, title="Test Review", content="Test Content", source="Test Source")
    db.add(review)
    db.commit()

    response = client.delete(f"/api/v1/literature-reviews/{review.id}")
    assert response.status_code == 200
    deleted_review = response.json()
    assert deleted_review["id"] == review.id

    # Verify the review is deleted
    db_review = db.query(LiteratureReview).filter(LiteratureReview.id == review.id).first()
    assert db_review is None