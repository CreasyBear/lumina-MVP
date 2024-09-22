import React, { useState, useEffect } from 'react'
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { useProblem } from '@/contexts/ProblemContext'
import { createAssumption, getAssumptions, performMonteCarloAnalysis, getAnalysisResults } from '@/services/api'
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert"
import { Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface Assumption {
  id: number
  description: string
  min_value: number
  max_value: number
  distribution: string
  impact_area: string
}

export default function AssumptionsTab() {
  const { activeProblem } = useProblem()
  const [assumptions, setAssumptions] = useState<Assumption[]>([])
  const [newAssumption, setNewAssumption] = useState<Omit<Assumption, 'id'>>({
    description: '',
    min_value: 0,
    max_value: 0,
    distribution: 'uniform',
    impact_area: 'cost'
  })
  const [baselineAnalysis, setBaselineAnalysis] = useState(null)
  const [monteCarloResults, setMonteCarloResults] = useState<any>(null)
  const [comparisonResults, setComparisonResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeProblem) {
      loadAssumptions()
      loadBaselineAnalysis()
    }
  }, [activeProblem])

  const loadAssumptions = async () => {
    if (activeProblem) {
      try {
        const results = await getAssumptions(activeProblem.id)
        setAssumptions(results)
      } catch (error) {
        console.error('Error loading assumptions:', error)
        setError('Failed to load assumptions.')
      }
    }
  }

  const loadBaselineAnalysis = async () => {
    if (activeProblem) {
      try {
        const results = await getAnalysisResults(activeProblem.id)
        if (results.length > 0) {
          setBaselineAnalysis(results[results.length - 1]) // Get the most recent analysis
        }
      } catch (error) {
        console.error('Error loading baseline analysis:', error)
        setError('Failed to load baseline analysis.')
      }
    }
  }

  const handleCreateAssumption = async () => {
    if (!activeProblem) {
      setError('No active problem selected.')
      return
    }

    try {
      await createAssumption({ ...newAssumption, problem_id: activeProblem.id })
      await loadAssumptions()
      setNewAssumption({
        description: '',
        min_value: 0,
        max_value: 0,
        distribution: 'uniform',
        impact_area: 'cost'
      })
    } catch (error) {
      console.error('Error creating assumption:', error)
      setError('Failed to create assumption.')
    }
  }

  const handleMonteCarloAnalysis = async () => {
    if (!activeProblem || assumptions.length === 0 || !baselineAnalysis) {
      setError('No active problem, assumptions, or baseline analysis available.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await performMonteCarloAnalysis({
        problem_id: activeProblem.id,
        iterations: 1000,
        assumptions: assumptions.map(a => a.id)
      })
      setMonteCarloResults(result)
      setComparisonResults([...comparisonResults, result])
    } catch (error) {
      console.error('Error performing Monte Carlo analysis:', error)
      setError('Failed to perform Monte Carlo analysis.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderMonteCarloChart = (results: any) => {
    if (!results) return null

    const chartData = Object.entries(results.summary).map(([impactArea, stats]: [string, any]) => ({
      name: impactArea,
      mean: stats.mean,
      median: stats.median,
      p5: stats['5th_percentile'],
      p95: stats['95th_percentile'],
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mean" stroke="#8884d8" />
          <Line type="monotone" dataKey="median" stroke="#82ca9d" />
          <Line type="monotone" dataKey="p5" stroke="#ffc658" />
          <Line type="monotone" dataKey="p95" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const renderComparisonChart = (results: any[]) => {
    if (results.length < 2) return null

    const chartData = results[0].results.map((_, index) => {
      const dataPoint: any = { name: `Iteration ${index + 1}` }
      results.forEach((result, resultIndex) => {
        Object.entries(result.results[index]).forEach(([impactArea, value]) => {
          dataPoint[`${impactArea} (Analysis ${resultIndex + 1})`] = value
        })
      })
      return dataPoint
    })

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {results.flatMap((result, index) =>
            Object.keys(result.results[0]).map(impactArea => (
              <Bar key={`${impactArea}-${index}`} dataKey={`${impactArea} (Analysis ${index + 1})`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
            ))
          )}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Assumptions Management</h2>

      {/* Baseline Analysis Summary */}
      {baselineAnalysis ? (
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold">Baseline Analysis</h3>
          <p>{baselineAnalysis.final_response}</p>
        </div>
      ) : (
        <Alert>
          <AlertTitle>No Baseline Analysis</AlertTitle>
          <AlertDescription>Please perform a base-case assessment in the Decomposition tab before adding assumptions.</AlertDescription>
        </Alert>
      )}

      {/* Form to create new assumption */}
      {baselineAnalysis && (
        <div className="space-y-2">
          <Input
            placeholder="Assumption description"
            value={newAssumption.description}
            onChange={(e) => setNewAssumption({ ...newAssumption, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Minimum value"
            value={newAssumption.min_value}
            onChange={(e) => setNewAssumption({ ...newAssumption, min_value: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Maximum value"
            value={newAssumption.max_value}
            onChange={(e) => setNewAssumption({ ...newAssumption, max_value: parseFloat(e.target.value) })}
          />
          <Select
            value={newAssumption.distribution}
            onValueChange={(value) => setNewAssumption({ ...newAssumption, distribution: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="triangular">Triangular</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newAssumption.impact_area}
            onValueChange={(value) => setNewAssumption({ ...newAssumption, impact_area: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select impact area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">Cost</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateAssumption}>Add Assumption</Button>
        </div>
      )}

      {/* List of existing assumptions */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Existing Assumptions</h3>
        {assumptions.map((assumption) => (
          <div key={assumption.id} className="p-2 bg-gray-700 rounded">
            <p>{assumption.description}</p>
            <p>Range: {assumption.min_value} - {assumption.max_value}</p>
            <p>Distribution: {assumption.distribution}</p>
            <p>Impact Area: {assumption.impact_area}</p>
          </div>
        ))}
      </div>

      {/* Monte Carlo Analysis */}
      {baselineAnalysis && assumptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Monte Carlo Analysis</h3>
          <Button onClick={handleMonteCarloAnalysis} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run Monte Carlo Analysis'
            )}
          </Button>
          {monteCarloResults && (
            <div className="p-4 bg-gray-700 rounded">
              <h4 className="text-lg font-semibold mb-2">Results Summary</h4>
              {renderMonteCarloChart(monteCarloResults)}
              {/* Detailed results table */}
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th>Impact Area</th>
                    <th>Mean</th>
                    <th>Median</th>
                    <th>Std Dev</th>
                    <th>5th Percentile</th>
                    <th>95th Percentile</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(monteCarloResults.summary).map(([impactArea, stats]: [string, any]) => (
                    <tr key={impactArea}>
                      <td>{impactArea}</td>
                      <td>{stats.mean.toFixed(2)}</td>
                      <td>{stats.median.toFixed(2)}</td>
                      <td>{stats.std_dev.toFixed(2)}</td>
                      <td>{stats['5th_percentile'].toFixed(2)}</td>
                      <td>{stats['95th_percentile'].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Comparison of Monte Carlo Analyses */}
      {comparisonResults.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Comparison of Analyses</h3>
          {renderComparisonChart(comparisonResults)}
        </div>
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