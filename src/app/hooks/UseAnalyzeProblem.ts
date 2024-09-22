import { useState } from 'react'
import { analyzeProblem } from '@/services/api'
import { AnalysisResult } from '@/services/api'

export function useAnalyzeProblem(activeProblemId: string | null) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (query: string) => {
    if (!activeProblemId) {
      setError('No active problem selected.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeProblem(activeProblemId, query)
      setAnalysis(result)
    } catch (err) {
      console.error('Error analyzing problem:', err)
      setError('Failed to analyze problem.')
    } finally {
      setIsLoading(false)
    }
  }

  return { analysis, isLoading, error, analyze }
}