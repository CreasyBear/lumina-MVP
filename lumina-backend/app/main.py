from fastapi import FastAPI
from app.api.api import api_router
from app.core.config import settings
from app.ai.deploy_config import setup_workflow_deployment
import asyncio

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    # Set up the workflow deployment
    asyncio.create_task(setup_workflow_deployment())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)