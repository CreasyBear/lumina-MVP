import React, { useState, ChangeEvent } from 'react'
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { createProblem } from '@/services/api'
import { useProblem } from '@/contexts/ProblemContext'
import { FormGroup } from "@/app/_components/ui/FormGroup"

interface ProblemTabProps {
  // Define any props if needed
}

interface ProblemState {
  title: string;
  description: string;
  client: string;
  status: 'New' | 'In Progress' | 'Completed';
}

export default function ProblemTab(props: ProblemTabProps) {
  const { activeProblem, setActiveProblem } = useProblem()
  const [problem, setProblem] = useState<ProblemState>(
    activeProblem || { title: '', description: '', client: '', status: 'New' }
  )

  const handleCreateProblem = async () => {
    try {
      const newProblem = await createProblem(problem)
      console.log('New problem created:', newProblem)
      setActiveProblem(newProblem)
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error creating problem:', error)
      // Optionally, display an error message to the user
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProblem(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {activeProblem ? 'Edit Problem' : 'Create New Problem'}
      </h2>
      <FormGroup label="Problem Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          placeholder="Problem Title"
          value={problem.title}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup label="Problem Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          placeholder="Problem Description"
          value={problem.description}
          onChange={handleInputChange}
          rows={5}
        />
      </FormGroup>
      <FormGroup label="Client" htmlFor="client">
        <Input
          id="client"
          name="client"
          placeholder="Client"
          value={problem.client}
          onChange={handleInputChange}
        />
      </FormGroup>
      <Button onClick={handleCreateProblem}>
        {activeProblem ? 'Update Problem' : 'Create Problem'}
      </Button>
    </div>
  )
}