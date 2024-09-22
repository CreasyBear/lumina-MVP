from app.db.base import SessionLocal, Base
from sqlalchemy import create_engine
import pytest

def test_db_connection():
    try:
        db = SessionLocal()
        # Try to query the database
        problems = db.query(Problem).all()
        print(f"Database connection successful. Found {len(problems)} problems.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db_connection()