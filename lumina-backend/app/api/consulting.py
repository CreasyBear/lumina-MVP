from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import numpy as np
from scipy import stats

from app.db.base import get_db
from app.models import consulting as models
from app.schemas import consulting as schemas
from app.ai.multi_step_engine import MultiStepConsultingEngine, SegmentOutput, MetaAnalysis

router = APIRouter()


@router.post("/problems/", response_model=schemas.Problem)
def create_problem(problem: schemas.ProblemCreate, db: Session = Depends(get_db)):
  db_problem = models.Problem(**problem.dict())
  db.add(db_problem)
  db.commit()
  db.refresh(db_problem)
  return db_problem

@router.get("/problems/", response_model=List[schemas.Problem])
def read_problems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  problems = db.query(models.Problem).offset(skip).limit(limit).all()
  return problems

@router.post("/segments/", response_model=schemas.Segment)
def create_segment(segment: schemas.SegmentCreate, db: Session = Depends(get_db)):
  db_segment = models.Segment(**segment.dict())
  db.add(db_segment)
  db.commit()
  db.refresh(db_segment)
  return db_segment

@router.get("/segments/", response_model=List[schemas.Segment])
def read_segments(problem_id: int, db: Session = Depends(get_db)):
  segments = db.query(models.Segment).filter(models.Segment.problem_id == problem_id).all()
  return segments

@router.post("/problems/{problem_id}/analyze", response_model=schemas.ProblemAnalysis)
def analyze_problem(problem_id: int, query: schemas.ProblemQuery, db: Session = Depends(get_db)):
  problem = db.query(models.Problem).filter(models.Problem.id == problem_id).first()
  if not problem:
    raise HTTPException(status_code=404, detail="Problem not found")

  engine = MultiStepConsultingEngine(problem)
  analysis_result = engine.query(query.query)

  # Save the segments
  for step in analysis_result["steps"]:
    segment = models.Segment(
      problem_id=problem_id,
      title=f"Step: {step['query'][:50]}...",
      description=step['query'],
      analysis=json.dumps(step['structured_output']),
      status="Pending",
      critical_assumptions=step['structured_output'].get('critical_assumptions', []),
      required_data=step['structured_output'].get('required_data', []),
      external_review_required=step['structured_output'].get('external_review_required', False)
    )
    db.add(segment)

  # Update problem's critical path
  problem.critical_path = analysis_result['meta_analysis'].get('critical_path', [])
  db.commit()

  return schemas.ProblemAnalysis(
    problem_id=problem_id,
    steps=analysis_result["steps"],
    final_response=analysis_result["final_response"],
    meta_analysis=analysis_result["meta_analysis"]
  )

# Add these routes
@router.post("/analysis-results/", response_model=AnalysisResult)
def create_analysis_result(analysis_result: AnalysisResultCreate, db: Session = Depends(get_db)):
    db_analysis_result = models.AnalysisResult(**analysis_result.dict())
    db.add(db_analysis_result)
    db.commit()
    db.refresh(db_analysis_result)
    return db_analysis_result

@router.get("/analysis-results/", response_model=List[AnalysisResult])
def read_analysis_results(problem_id: int, db: Session = Depends(get_db)):
    analysis_results = db.query(models.AnalysisResult).filter(
        models.AnalysisResult.problem_id == problem_id
    ).order_by(models.AnalysisResult.created_at.desc()).all()
    return analysis_results

@router.post("/assumptions/", response_model=schemas.Assumption)
def create_assumption(assumption: schemas.AssumptionCreate, db: Session = Depends(get_db)):
    db_assumption = models.Assumption(**assumption.dict())
    db.add(db_assumption)
    db.commit()
    db.refresh(db_assumption)
    return db_assumption

@router.get("/assumptions/{problem_id}", response_model=List[schemas.Assumption])
def get_assumptions(problem_id: int, db: Session = Depends(get_db)):
    assumptions = db.query(models.Assumption).filter(models.Assumption.problem_id == problem_id).all()
    return assumptions

@router.post("/monte-carlo-analysis/", response_model=schemas.MonteCarloAnalysisResult)
def perform_monte_carlo_analysis(request: schemas.MonteCarloAnalysisRequest, db: Session = Depends(get_db)):
    assumptions = db.query(models.Assumption).filter(models.Assumption.id.in_(request.assumptions)).all()

    results = []
    for _ in range(request.iterations):
        iteration_result = {}
        for assumption in assumptions:
            if assumption.distribution == 'uniform':
                value = np.random.uniform(assumption.min_value, assumption.max_value)
            elif assumption.distribution == 'normal':
                mean = (assumption.max_value + assumption.min_value) / 2
                std_dev = (assumption.max_value - assumption.min_value) / 6  # Assuming 99.7% of values fall within min and max
                value = np.random.normal(mean, std_dev)
            elif assumption.distribution == 'triangular':
                mode = (assumption.max_value + assumption.min_value) / 2  # Assuming symmetric triangular distribution
                value = np.random.triangular(assumption.min_value, mode, assumption.max_value)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported distribution: {assumption.distribution}")

            iteration_result[assumption.impact_area] = value
        results.append(iteration_result)

    summary = {
        impact_area: {
            'mean': np.mean([r[impact_area] for r in results]),
            'median': np.median([r[impact_area] for r in results]),
            'std_dev': np.std([r[impact_area] for r in results]),
            '5th_percentile': np.percentile([r[impact_area] for r in results], 5),
            '95th_percentile': np.percentile([r[impact_area] for r in results], 95),
        }
        for impact_area in results[0].keys()
    }

    return schemas.MonteCarloAnalysisResult(
        assumption_id=request.assumptions[0],  # Just using the first assumption ID for now
        iterations=request.iterations,
        results=results,
        summary=summary
    )

@router.patch("/segments/{segment_id}", response_model=schemas.Segment)
def update_segment(segment_id: int, segment_update: schemas.SegmentUpdate, db: Session = Depends(get_db)):
    db_segment = db.query(models.Segment).filter(models.Segment.id == segment_id).first()
    if not db_segment:
        raise HTTPException(status_code=404, detail="Segment not found")

    for key, value in segment_update.dict(exclude_unset=True).items():
        setattr(db_segment, key, value)

    db.commit()
    db.refresh(db_segment)
    return db_segment

@router.post("/milestones/", response_model=schemas.Milestone)
def create_milestone(milestone: schemas.MilestoneCreate, db: Session = Depends(get_db)):
    db_milestone = models.Milestone(**milestone.dict())
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@router.get("/milestones/", response_model=List[schemas.Milestone])
def get_milestones(problem_id: int, db: Session = Depends(get_db)):
    milestones = db.query(models.Milestone).filter(models.Milestone.problem_id == problem_id).all()
    return milestones

@router.patch("/milestones/{milestone_id}", response_model=schemas.Milestone)
def update_milestone(milestone_id: int, milestone_update: schemas.MilestoneBase, db: Session = Depends(get_db)):
    db_milestone = db.query(models.Milestone).filter(models.Milestone.id == milestone_id).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    for key, value in milestone_update.dict().items():
        setattr(db_milestone, key, value)

    db.commit()
    db.refresh(db_milestone)
    return db_milestone