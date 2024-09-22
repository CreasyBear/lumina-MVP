from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from app.core.config import settings

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.CLERK_API_URL}/token/verify",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            params={"token": token}
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return response.json()

async def get_current_user(token_data: dict = Depends(verify_token)):
    return token_data