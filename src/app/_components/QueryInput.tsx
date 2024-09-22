import React from 'react'
import { Input } from "@/app/_components/ui/input"
import { LoadingButton } from "@/app/_components/ui/LoadingButton"

interface QueryInputProps {
  query: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAnalyze: () => void
  isLoading: boolean
}

export const QueryInput: React.FC<QueryInputProps> = ({ query, onChange, onAnalyze, isLoading }) => (
  <div className="flex space-x-2">
    <Input
      placeholder="Enter your query"
      value={query}
      onChange={onChange}
      disabled={isLoading}
      className="flex-grow"
    />
    <LoadingButton onClick={onAnalyze} isLoading={isLoading}>
      Analyze
    </LoadingButton>
  </div>
)