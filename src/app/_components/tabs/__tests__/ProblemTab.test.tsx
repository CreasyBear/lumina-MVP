import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProblemTab from '../ProblemTab'
import { ProblemProvider } from '@/contexts/ProblemContext'

// Mock the ProblemContext
jest.mock('@/contexts/ProblemContext', () => ({
  ProblemProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useProblem: () => ({
    activeProblem: null,
    setActiveProblem: jest.fn(),
  }),
}))

describe('ProblemTab', () => {
  it('renders ProblemTab and handles input', () => {
    render(
      <ProblemProvider>
        <ProblemTab />
      </ProblemProvider>
    )

    const titleInput = screen.getByLabelText('Problem Title')
    fireEvent.change(titleInput, { target: { value: 'New Problem' } })
    expect(titleInput).toHaveValue('New Problem')

    const createButton = screen.getByText('Create Problem')
    expect(createButton).toBeInTheDocument()
  })
})