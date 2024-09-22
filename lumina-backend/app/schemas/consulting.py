from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProblemBase(BaseModel):
  title: str
  description: str
  client: str
  status: str
  critical_path: Optional[Dict[str, Any]]

class ProblemCreate(ProblemBase):
  pass

class Problem(ProblemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SegmentBase(BaseModel):
  title: str
  description: str
  analysis: Optional[str] = None
  potential_solution: Optional[str] = None
  status: str
  critical_assumptions: Optional[Dict[str, Any]]
  required_data: Optional[Dict[str, Any]]
  external_review_required: bool = False
  external_review_status: Optional[str] = None

class SegmentCreate(SegmentBase):
  problem_id: int
  parent_id: Optional[int] = None

class Segment(SegmentBase):
  id: int
  problem_id: int
  parent_id: Optional[int] = None

  class Config:
      orm_mode = True

class ProblemQuery(BaseModel):
    query: str

class ProblemAnalysis(BaseModel):
    problem_id: int
    steps: List[AnalysisStep]
    final_response: str
    meta_analysis: MetaAnalysis

class SegmentOutput(BaseModel):
    key_findings: List[str]
    relevant_data: Dict[str, Any]
    next_steps: List[str]
    confidence_score: float

class AnalysisStep(BaseModel):
    query: str
    response: str
    structured_output: SegmentOutput

class MetaAnalysis(BaseModel):
    coherence_score: float
    consistency_score: float
    quality_score: float
    improvement_suggestions: List[str]

class Assumption(BaseModel):
    id: Optional[int]
    problem_id: int
    description: str
    min_value: float
    max_value: float
    distribution: str  # e.g., 'uniform', 'normal', 'triangular'
    impact_area: str  # e.g., 'cost', 'time', 'quality'

class AssumptionCreate(BaseModel):
    problem_id: int
    description: str
    min_value: float
    max_value: float
    distribution: str
    impact_area: str

class MonteCarloResult(BaseModel):
    assumption_id: int
    iterations: int
    results: List[Dict[str, float]]
    summary: Dict[str, float]  # e.g., mean, median, std_dev

class MonteCarloAnalysisRequest(BaseModel):
    problem_id: int
    iterations: int = 1000
    assumptions: List[int]  # List of assumption IDs to include in the analysis

class MilestoneBase(BaseModel):
    title: str
    due_date: datetime
    completed: bool

class MilestoneCreate(MilestoneBase):
    problem_id: int

class Milestone(MilestoneBase):
    id: int
    problem_id: int

    class Config:
        orm_mode = True

class SegmentUpdate(BaseModel):
    progress: float

class MonteCarloAnalysisResult(BaseModel):
    assumption_id: int
    iterations: int
    results: List[Dict[str, float]]
    summary: Dict[str, Dict[str, float]]