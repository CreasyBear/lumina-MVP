import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { AnalysisResult } from '@/types/problem'

interface SavedAnalysesSelectProps {
  savedAnalyses: AnalysisResult[]
  onLoadAnalysis: (analysis: AnalysisResult) => void
}

export const SavedAnalysesSelect: React.FC<SavedAnalysesSelectProps> = ({ savedAnalyses, onLoadAnalysis }) => (
  <Select onValueChange={(value) => onLoadAnalysis(JSON.parse(value))}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Load saved analysis" />
    </SelectTrigger>
    <SelectContent>
      {savedAnalyses.map((savedAnalysis, index) => (
        <SelectItem key={index} value={JSON.stringify(savedAnalysis)}>
          {savedAnalysis.steps[0].query.substring(0, 30)}...
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)