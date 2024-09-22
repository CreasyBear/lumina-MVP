import React, { useState, useEffect } from 'react';
import { useProblemStore } from '@/stores/problemStore';
import { analyzeProblem } from '@/services/api';
import { AnalysisResult } from '@/services/api'; // Import AnalysisResult from api.ts instead of types/problem
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Loader2 } from 'lucide-react';
import ProblemSegmentVisualization from '../ProblemSegmentVisualization';

export default function DecompositionTab() {
  const { activeProblem, analysis, setAnalysis } = useProblemStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!activeProblem) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeProblem(activeProblem.id, query);
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing problem:', err);
      setError('Failed to analyze problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Problem Decomposition</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your analysis query"
          className="flex-grow"
        />
        <Button onClick={handleAnalyze} disabled={isLoading || !query}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Analyze
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {analysis && (
        <div>
          <h3 className="text-xl font-semibold mt-4">Analysis Result</h3>
          <ProblemSegmentVisualization analysis={analysis} />
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Final Response</h4>
            <p>{analysis.final_response}</p>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Meta Analysis</h4>
            <ul>
              <li>Coherence Score: {analysis.meta_analysis.coherence_score}</li>
              <li>Consistency Score: {analysis.meta_analysis.consistency_score}</li>
              <li>Quality Score: {analysis.meta_analysis.quality_score}</li>
            </ul>
            <h5 className="font-semibold mt-2">Improvement Suggestions:</h5>
            <ul>
              {analysis.meta_analysis.improvement_suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
            <h5 className="font-semibold mt-2">Critical Path:</h5>
            <ul>
              {analysis.meta_analysis.critical_path.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}