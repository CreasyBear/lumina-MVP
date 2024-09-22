import { useState, useEffect } from 'react'
import { Search, Plus, FileText, BarChart2, BookOpen, GitBranch, Settings, HelpCircle, User } from 'lucide-react'
import { Button } from "@/app/_components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Input } from "@/app/_components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/_components/ui/tooltip"
import ConsultingTool from '@/app/_components/ConsultingTool'
import { useProblem } from '@/app/_contexts/ProblemContext'
import { createProblem, loadProblem, getReports, getLiteratureReviews, createLiteratureReview } from '@/services/api'
import { ProblemData, LiteratureReview } from '@/types/problem'

type TabType = 'problem' | 'decomposition' | 'assumptions' | 'progress'

export default function Frontpage() {
  const { activeProblem, setActiveProblem } = useProblem()
  const [activeTab, setActiveTab] = useState<TabType>('problem')
  const [selectedModel, setSelectedModel] = useState<string>('gpt4')
  const [dataSources, setDataSources] = useState<string[]>([])
  const [newDataSource, setNewDataSource] = useState<string>('')
  const [literatureReviews, setLiteratureReviews] = useState<LiteratureReview[]>([])

  useEffect(() => {
    if (activeProblem) {
      fetchLiteratureReviews(activeProblem.id)
    }
  }, [activeProblem])

  const fetchLiteratureReviews = async (problemId: string) => {
    try {
      const reviews = await getLiteratureReviews(problemId)
      setLiteratureReviews(reviews)
    } catch (error) {
      console.error('Error fetching literature reviews:', error)
    }
  }

  const handleAddDataSource = () => {
    if (newDataSource) {
      setDataSources([...dataSources, newDataSource])
      setNewDataSource('')
    }
  }

  const handleNewProblem = async () => {
    try {
      const newProblemData: ProblemData = {
        title: 'New Problem',
        description: '',
        client: '',
        status: 'New'
      }
      const newProblem = await createProblem(newProblemData)
      setActiveProblem(newProblem)
    } catch (error) {
      console.error('Error creating new problem:', error)
    }
  }

  const handleLoadProblem = async () => {
    try {
      // Assuming you have a way to get the selected problem ID
      const selectedProblemId = "123" // Replace this with actual selected problem ID
      const loadedProblem = await loadProblem(selectedProblemId)
      setActiveProblem(loadedProblem)
    } catch (error) {
      console.error('Error loading problem:', error)
    }
  }

  const handleViewReports = async () => {
    try {
      const reports = await getReports()
      // Implement logic to display reports
      console.log(reports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleCreateLiteratureReview = async () => {
    if (!activeProblem) return
    try {
      const newReview = await createLiteratureReview({
        problem_id: activeProblem.id,
        title: 'New Literature Review',
        content: '',
        sources: [],
      })
      setLiteratureReviews([...literatureReviews, newReview])
    } catch (error) {
      console.error('Error creating literature review:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold">Lumina AI</span>
          <span className="bg-blue-500 text-xs px-2 py-1 rounded">Beta</span>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleNewProblem}>
            <FileText className="mr-2 h-4 w-4" />
            New Problem
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleLoadProblem}>
            <Search className="mr-2 h-4 w-4" />
            Load Problem
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleViewReports}>
            <BarChart2 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-semibold">AI Model</h3>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt4">GPT-4</SelectItem>
              <SelectItem value="llamaindex">LlamaIndex</SelectItem>
              <SelectItem value="custom">Custom Model</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-semibold">Data Sources</h3>
          <div className="flex space-x-2 mb-2">
            <Input
              type="text"
              placeholder="Enter data source"
              value={newDataSource}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDataSource(e.target.value)}
              className="flex-grow"
            />
            <Button variant="outline" size="sm" onClick={handleAddDataSource}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {dataSources.map((source, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-sm">{source}</div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex-grow overflow-auto">
          <h3 className="mb-2 text-sm font-semibold">Literature Review</h3>
          {literatureReviews.length > 0 ? (
            <div className="space-y-2">
              {literatureReviews.map((review) => (
                <div key={review.id} className="bg-gray-700 p-2 rounded text-sm">
                  <p className="font-semibold">{review.title}</p>
                  <p className="text-gray-400">{review.sources.length} sources</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No literature reviews available</p>
          )}
          <Button variant="outline" className="mt-2 w-full" onClick={handleCreateLiteratureReview}>
            <Plus className="mr-2 h-4 w-4" />
            New Literature Review
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-2">
            {(['problem', 'decomposition', 'assumptions', 'progress'] as TabType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>User Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <ConsultingTool initialActiveTab={activeTab} />
      </div>

      {/* Right Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Activity</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Literature Review
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <GitBranch className="mr-2 h-4 w-4" />
            Version History
          </Button>
        </div>
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-semibold">Recent Activities</h3>
          <div className="space-y-2">
            <div className="bg-gray-700 p-2 rounded text-sm">
              <p className="font-semibold">Problem Definition Updated</p>
              <p className="text-gray-400">2 minutes ago</p>
            </div>
            <div className="bg-gray-700 p-2 rounded text-sm">
              <p className="font-semibold">New Data Source Added</p>
              <p className="text-gray-400">15 minutes ago</p>
            </div>
            <div className="bg-gray-700 p-2 rounded text-sm">
              <p className="font-semibold">Assumption Analysis Completed</p>
              <p className="text-gray-400">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}