from sqlalchemy.orm import Session
from app.core.config import settings
import httpx

async def verify_access_token(db: Session, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.CLERK_API_URL}/token/verify",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            params={"token": token}
        )
        if response.status_code != 200:
            return None
        return response.json()