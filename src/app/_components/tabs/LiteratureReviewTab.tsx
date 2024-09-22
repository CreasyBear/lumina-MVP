import React, { useState, useEffect } from 'react'
import { useProblem } from '@/app/_contexts/ProblemContext'
import { getLiteratureReviews } from '@/services/api'
import { LiteratureReview } from '@/types/problem'
import LiteratureReviewComponent from '@/app/_components/LiteratureReviewComponent'
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function LiteratureReviewTab() {
  const { activeProblem } = useProblem()
  const [literatureReviews, setLiteratureReviews] = useState<LiteratureReview[]>([])
  const [selectedReview, setSelectedReview] = useState<LiteratureReview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeProblem) {
      fetchLiteratureReviews(activeProblem.id)
    }
  }, [activeProblem])

  const fetchLiteratureReviews = async (problemId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const reviews = await getLiteratureReviews(problemId)
      setLiteratureReviews(reviews)
    } catch (error) {
      console.error('Error fetching literature reviews:', error)
      setError('Failed to fetch literature reviews. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewUpdate = (updatedReview: LiteratureReview) => {
    setLiteratureReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      )
    )
    setSelectedReview(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Literature Reviews</h2>
      {selectedReview ? (
        <LiteratureReviewComponent review={selectedReview} onUpdate={handleReviewUpdate} />
      ) : (
        <div className="space-y-2">
          {literatureReviews.map(review => (
            <div
              key={review.id}
              className="bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => setSelectedReview(review)}
            >
              <h3 className="text-lg font-semibold">{review.title}</h3>
              <p className="text-sm text-gray-300">{review.sources.length} sources</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}