import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProblemData } from '@/services/api';

interface ProblemContextType {
  activeProblem: ProblemData | null;
  setActiveProblem: (problem: ProblemData | null) => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [activeProblem, setActiveProblem] = useState<ProblemData | null>(null);

  return (
    <ProblemContext.Provider value={{ activeProblem, setActiveProblem }}>
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblem() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider');
  }
  return context;
}