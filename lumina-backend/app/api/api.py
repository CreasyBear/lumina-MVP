from fastapi import APIRouter
from app.api.endpoints import literature_review, problem  # Add problem import

api_router = APIRouter()
api_router.include_router(literature_review.router, prefix="/literature-reviews", tags=["literature_reviews"])
api_router.include_router(problem.router, prefix="/problems", tags=["problems"])  # Add this line
# Include other routers as needed