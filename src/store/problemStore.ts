import { create } from 'zustand'
import { AnalysisResult } from '@/services/api'

interface ProblemState {
  activeProblem: any | null
  analysis: AnalysisResult | null
  setActiveProblem: (problem: any) => void
  setAnalysis: (analysis: AnalysisResult) => void
}

export const useProblemStore = create<ProblemState>((set) => ({
  activeProblem: null,
  analysis: null,
  setActiveProblem: (problem) => set({ activeProblem: problem }),
  setAnalysis: (analysis) => set({ analysis }),
}))