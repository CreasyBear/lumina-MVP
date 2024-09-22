export interface Problem {
  id: number;
  title: string;
  description: string;
  client: string;
  status: string;
}

export interface ProblemData {
  title: string;
  description: string;
  client: string;
  status: string;
}

export interface LiteratureReview {
  id: number;
  problem_id: number;
  title: string;
  content: string;
  source: string;
}

export interface SegmentOutput {
  key_findings: string[];
  relevant_data: Record<string, any>;
  next_steps: string[];
  confidence_score: number;
  critical_assumptions: string[];
  required_data: string[];
  external_review_required: boolean;
}

export interface AnalysisStep {
  query: string;
  response: string;
  structured_output: SegmentOutput;
}

export interface MetaAnalysis {
  coherence_score: number;
  consistency_score: number;
  quality_score: number;
  improvement_suggestions: string[];
  critical_path: string[];
}

export interface AnalysisResult {
  steps: AnalysisStep[];
  final_response: string;
  meta_analysis: MetaAnalysis;
}