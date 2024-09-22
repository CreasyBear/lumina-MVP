import React, { useState, useEffect } from 'react'
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { useProblem } from '@/contexts/ProblemContext'
import { getSegments, updateSegment, createMilestone, getMilestones } from '@/services/api'
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert"
import { Loader2, Plus } from 'lucide-react'
import { ProgressBar } from "@/app/_components/ui/progress-bar"
import { Timeline, TimelineItem } from "@/app/_components/ui/timeline"

interface Segment {
  id: number
  title: string
  status: string
  progress: number
}

interface Milestone {
  id: number
  title: string
  dueDate: string
  completed: boolean
}

export default function ProgressTab() {
  const { activeProblem } = useProblem()
  const [segments, setSegments] = useState<Segment[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeProblem) {
      loadSegments()
      loadMilestones()
    }
  }, [activeProblem])

  const loadSegments = async () => {
    if (activeProblem) {
      setIsLoading(true)
      try {
        const results = await getSegments(activeProblem.id)
        setSegments(results)
      } catch (error) {
        console.error('Error loading segments:', error)
        setError('Failed to load segments.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const loadMilestones = async () => {
    if (activeProblem) {
      setIsLoading(true)
      try {
        const results = await getMilestones(activeProblem.id)
        setMilestones(results)
      } catch (error) {
        console.error('Error loading milestones:', error)
        setError('Failed to load milestones.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleUpdateProgress = async (segmentId: number, progress: number) => {
    try {
      await updateSegment(segmentId, { progress })
      setSegments(segments.map(seg =>
        seg.id === segmentId ? { ...seg, progress } : seg
      ))
    } catch (error) {
      console.error('Error updating segment progress:', error)
      setError('Failed to update segment progress.')
    }
  }

  const handleCreateMilestone = async () => {
    if (!activeProblem) return
    try {
      const createdMilestone = await createMilestone({
        ...newMilestone,
        problemId: activeProblem.id,
        completed: false
      })
      setMilestones([...milestones, createdMilestone])
      setNewMilestone({ title: '', dueDate: '' })
    } catch (error) {
      console.error('Error creating milestone:', error)
      setError('Failed to create milestone.')
    }
  }

  const calculateOverallProgress = () => {
    if (segments.length === 0) return 0
    const totalProgress = segments.reduce((sum, segment) => sum + segment.progress, 0)
    return totalProgress / segments.length
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Progress Tracking</h2>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Overall Progress</h3>
            <ProgressBar progress={calculateOverallProgress()} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Segment Progress</h3>
            {segments.map(segment => (
              <div key={segment.id} className="space-y-2">
                <h4 className="text-lg font-medium">{segment.title}</h4>
                <div className="flex items-center space-x-2">
                  <ProgressBar progress={segment.progress} />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={segment.progress}
                    onChange={(e) => handleUpdateProgress(segment.id, Number(e.target.value))}
                    className="w-20"
                  />
                  <span>%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Milestones</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              />
              <Input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              />
              <Button onClick={handleCreateMilestone}>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
            <Timeline>
              {milestones.map((milestone) => (
                <TimelineItem
                  key={milestone.id}
                  title={milestone.title}
                  date={new Date(milestone.dueDate).toLocaleDateString()}
                  completed={milestone.completed}
                />
              ))}
            </Timeline>
          </div>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}