import React from 'react'
import { AnalysisResult } from '@/types/problem'

interface AnalysisTreeProps {
  data: AnalysisResult;
}

const AnalysisTree: React.FC<AnalysisTreeProps> = ({ data }) => {
  return (
    <div>
      <h3>Analysis Results</h3>
      {data.steps.map((step, index) => (
        <div key={index}>
          <h4>Step {index + 1}</h4>
          <p>Query: {step.query}</p>
          <p>Response: {step.response}</p>
          <h5>Key Findings:</h5>
          <ul>
            {step.structured_output.key_findings.map((finding, findingIndex) => (
              <li key={findingIndex}>{finding}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default AnalysisTree