"""
Main application file for the Lumina AI-Assisted Consulting Tool backend.
This file sets up the FastAPI application and includes the API router.
"""

from fastapi import FastAPI
from app.api.api import api_router
from app.core.config import settings
import uvicorn
import os

app: FastAPI = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )

# Hint: Make sure to set the following environment variables:
# - HOST: The host to run the server on (default: 0.0.0.0)
# - PORT: The port to run the server on (default: 8000)
# - DATABASE_URL: The URL for your database connection
# - SECRET_KEY: A secret key for security purposes