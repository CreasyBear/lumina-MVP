import sys
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from fastapi.responses import JSONResponse

# Add the project root directory to the Python path
project_root = Path(__file__).parents[1]
sys.path.insert(0, str(project_root))

# Set test environment variables
os.environ['CLERK_PUBLISHABLE_KEY'] = 'test_publishable_key'
os.environ['CLERK_SECRET_KEY'] = 'test_secret_key'
os.environ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
os.environ['OPENAI_API_KEY'] = 'test_openai_api_key'

from app.db.base import Base
from app.api import deps
from app.models.consulting import Problem, Segment, Relationship, Milestone

# Mock imports
from unittest.mock import MagicMock

# Replace the AsyncMock import with this
class AsyncMock(MagicMock):
    async def __call__(self, *args, **kwargs):
        return super(AsyncMock, self).__call__(*args, **kwargs)

class AsyncMockWithAttributes(AsyncMock):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__dict__.update(kwargs)

sys.modules['app.ai.multi_step_engine'] = AsyncMockWithAttributes(
    query=AsyncMock(),
    generate_structured_output_async=AsyncMock()
)
sys.modules['app.crud'] = AsyncMockWithAttributes()
sys.modules['app.crud.crud'] = AsyncMockWithAttributes()

# Define MockSchema with custom config
class MockSchema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

# Mock individual schema files, ignoring literature review
schema_files = ['problem']
for file in schema_files:
    mock_module = MagicMock()
    if file == 'problem':
        schema_names = ['ProblemBase', 'ProblemCreate', 'ProblemUpdate', 'AnalysisResult', 'AnalysisRequest']
    for name in schema_names:
        setattr(mock_module, name, MockSchema)
    sys.modules[f'app.schemas.{file}'] = mock_module

# Ensure LiteratureReviewUpdate is not mocked
from app.schemas.literature_review import LiteratureReviewUpdate
sys.modules['app.schemas.literature_review'].LiteratureReviewUpdate = LiteratureReviewUpdate

# Remove literature review mocking
# sys.modules['app.schemas.literature_review'] = MagicMock()
# sys.modules['app.schemas.literature_review'].LiteratureReview = mock_literature_review
# sys.modules['app.schemas.literature_review'].LiteratureReviewUpdate = mock_literature_review_update

# Now import the app
from main import app

# Create a new engine instance
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Add this import
import sys

# Add this at the top of the file
print("Python path:", sys.path)
print("Loaded modules:", sys.modules.keys())

@pytest.fixture
def client():
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[deps.get_db] = override_get_db

    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
async def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    await session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
async def client():
    async with TestClient(app) as c:
        yield c