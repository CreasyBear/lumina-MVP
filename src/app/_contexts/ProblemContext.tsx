import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Problem } from '@/types/problem'

type ProblemContextType = {
  activeProblem: Problem | null
  setActiveProblem: (problem: Problem | null) => void
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined)

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)

  return (
    <ProblemContext.Provider value={{ activeProblem, setActiveProblem }}>
      {children}
    </ProblemContext.Provider>
  )
}

export function useProblem() {
  const context = useContext(ProblemContext)
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider')
  }
  return context
}