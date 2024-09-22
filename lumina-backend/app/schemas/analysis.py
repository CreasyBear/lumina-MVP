from pydantic import BaseModel
from typing import List, Optional

class AnalysisStep(BaseModel):
    query: str
    response: str

class AnalysisResult(BaseModel):
    steps: List[AnalysisStep]
    final_response: str

class AnalysisRequest(BaseModel):
    query: str