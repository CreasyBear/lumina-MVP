from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lumina AI-Assisted Consulting Tool"
    API_V1_STR: str = "/api/v1"
    CLERK_PUBLISHABLE_KEY: str = "test_publishable_key"
    CLERK_SECRET_KEY: str = "test_secret_key"
    CLERK_API_URL: str = "https://api.clerk.dev/v1"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./test.db"

    class Config:
        env_file = ".env"

settings = Settings()