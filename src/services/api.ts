import axios from 'axios'
import { Problem, ProblemData } from '@/types/problem'
// Remove the import for LiteratureReview and AnalysisResult from @/types/problem

// Add type declarations for arize-phoenix-otel
declare module 'arize-phoenix-otel' {
  export function trace(fn: Function): Function;
}
import { trace } from 'arize-phoenix-otel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

export interface AnalysisResult {
  problem_id: number
  query: string
  steps: Array<{ query: string; response: string }>
  final_response: string
  reflection: string
  structured_output: Record<string, any>
}

export interface Assumption {
  id: number
  problem_id: number
  description: string
  min_value: number
  max_value: number
  distribution: string
  impact_area: string
}

export interface AssumptionCreate {
  problem_id: number
  description: string
  min_value: number
  max_value: number
  distribution: string
  impact_area: string
}

export interface MonteCarloAnalysisRequest {
  problem_id: number
  iterations: number
  assumptions: number[]
}

export interface MonteCarloResult {
  assumption_id: number
  iterations: number
  results: Array<Record<string, number>>
  summary: Record<string, Record<string, number>>
}

export interface Segment {
  id: number
  title: string
  status: string
  progress: number
}

export interface Milestone {
  id: number
  title: string
  dueDate: string
  completed: boolean
  problemId: number
}

export const createProblem = async (problemData: ProblemData): Promise<Problem> => {
  const response = await api.post<Problem>('/api/consulting/problems/', problemData)
  return response.data
}

export const getProblems = async (skip = 0, limit = 100) => {
  const response = await api.get<ProblemData[]>('/api/consulting/problems/', { params: { skip, limit } })
  return response.data
}

export const analyzeProblem = async (problemId: number, query: string): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>(`/api/consulting/problems/${problemId}/analyze`, { query });
  return response.data;
};

export const createSegment = async (segmentData: any) => {
  const response = await api.post('/api/consulting/segments/', segmentData)
  return response.data
}

export const getSegments = async (problemId: number) => {
  const response = await api.get('/api/consulting/segments/', { params: { problem_id: problemId } })
  return response.data
}

export const updateSegment = async (segmentId: number, updateData: Partial<Segment>) => {
  const response = await api.patch<Segment>(`/api/consulting/segments/${segmentId}`, updateData)
  return response.data
}

export const saveAnalysisResult = trace(async (result: AnalysisResult): Promise<void> => {
  const response = await api.post('/api/consulting/analysis-results/', result)
  return response.data
})

export const getAnalysisResults = async (problemId: number) => {
  const response = await api.get<AnalysisResult[]>('/api/consulting/analysis-results/', {
    params: { problem_id: problemId },
    headers: { 'Cache-Control': 'no-cache' }  // Ensure we always get the latest results
  })
  return response.data
}

export const createAssumption = async (assumptionData: AssumptionCreate) => {
  const response = await api.post<Assumption>('/api/consulting/assumptions/', assumptionData)
  return response.data
}

export const getAssumptions = async (problemId: number) => {
  const response = await api.get<Assumption[]>(`/api/consulting/assumptions/${problemId}`)
  return response.data
}

export const performMonteCarloAnalysis = async (request: MonteCarloAnalysisRequest) => {
  const response = await api.post<MonteCarloResult>('/api/consulting/monte-carlo-analysis/', request)
  return response.data
}

export const createMilestone = async (milestoneData: Omit<Milestone, 'id'>) => {
  const response = await api.post<Milestone>('/api/consulting/milestones/', milestoneData)
  return response.data
}

export const getMilestones = async (problemId: number) => {
  const response = await api.get<Milestone[]>('/api/consulting/milestones/', { params: { problem_id: problemId } })
  return response.data
}

export const updateMilestone = async (milestoneId: number, updateData: Partial<Milestone>) => {
  const response = await api.patch<Milestone>(`/api/consulting/milestones/${milestoneId}`, updateData)
  return response.data
}

export const loadProblem = async (id: string): Promise<Problem> => {
  const response = await api.get<Problem>(`/api/consulting/problems/${id}`)
  return response.data
}

export const getReports = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/api/consulting/reports/')
  return response.data
}

export interface LiteratureReview {
  id: string
  problem_id: string
  title: string
  content: string
  sources: string[]
}

export interface LiteratureReviewCreate {
  problem_id: string
  title: string
  content: string
  sources: string[]
}

export const getLiteratureReviews = async (problemId: string): Promise<LiteratureReview[]> => {
  const response = await api.get<LiteratureReview[]>('/api/consulting/literature-reviews/', {
    params: { problem_id: problemId }
  })
  return response.data
}

export const createLiteratureReview = async (reviewData: LiteratureReviewCreate): Promise<LiteratureReview> => {
  const response = await api.post<LiteratureReview>('/api/consulting/literature-reviews/', reviewData)
  return response.data
}

export const updateLiteratureReview = async (
  id: string,
  updateData: Partial<LiteratureReview>
): Promise<LiteratureReview> => {
  const response = await api.patch<LiteratureReview>(`/api/consulting/literature-reviews/${id}`, updateData)
  return response.data
}
