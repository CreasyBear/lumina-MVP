import React, { useState } from 'react'
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { LiteratureReview } from '@/types/problem'
import { updateLiteratureReview } from '@/services/api'
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert"
import { Loader2 } from 'lucide-react'

interface LiteratureReviewComponentProps {
  review: LiteratureReview
  onUpdate: (updatedReview: LiteratureReview) => void
}

export default function LiteratureReviewComponent({ review, onUpdate }: LiteratureReviewComponentProps) {
  const [title, setTitle] = useState(review.title)
  const [content, setContent] = useState(review.content)
  const [sources, setSources] = useState(review.sources)
  const [newSource, setNewSource] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedReview = await updateLiteratureReview(review.id, {
        title,
        content,
        sources,
      })
      onUpdate(updatedReview)
    } catch (error) {
      console.error('Error updating literature review:', error)
      setError('Failed to update literature review. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSource = () => {
    if (newSource) {
      setSources([...sources, newSource])
      setNewSource('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review Title"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Review Content"
        rows={10}
      />
      <div>
        <h4 className="text-sm font-semibold mb-2">Sources</h4>
        {sources.map((source, index) => (
          <div key={index} className="bg-gray-700 p-2 rounded text-sm mb-2">{source}</div>
        ))}
        <div className="flex space-x-2">
          <Input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Add new source"
          />
          <Button onClick={handleAddSource}>Add</Button>
        </div>
      </div>
      <Button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Update Review
      </Button>
    </div>
  )
}