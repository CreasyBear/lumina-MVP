import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/app/_components/ui/button"
import { Maximize2, Sun, User } from 'lucide-react'
import { useProblem } from '@/contexts/ProblemContext'
import ErrorBoundary, { withErrorBoundary } from '@/app/_components/ErrorBoundary'

// Split tabs into individual files if not already
import ProblemTab from './tabs/ProblemTab'
import DecompositionTab from './tabs/DecompositionTab'
import AssumptionsTab from './tabs/AssumptionsTab'
import ProgressTab from './tabs/ProgressTab'
import LiteratureReviewTab from './tabs/LiteratureReviewTab'

type TabType = 'problem' | 'decomposition' | 'assumptions' | 'progress' | 'literature'

interface ConsultingToolProps {
  initialActiveTab: TabType
}

const ConsultingTool: React.FC<ConsultingToolProps> = ({ initialActiveTab }) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialActiveTab)
  const { activeProblem } = useProblem()

  const tabs: TabType[] = ['problem', 'decomposition', 'assumptions', 'progress', 'literature']

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'problem':
        return <ProblemTab />
      case 'decomposition':
        return <DecompositionTab />
      case 'assumptions':
        return <AssumptionsTab />
      case 'progress':
        return <ProgressTab />
      case 'literature':
        return <LiteratureReviewTab />
      default:
        return <div>Invalid tab</div>
    }
  }

  // Adjust layout for smaller screens
  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-between items-center flex-wrap">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="whitespace-nowrap"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button size="icon" variant="ghost" title="Fullscreen">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" title="Toggle theme">
              <Sun className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" title="User settings">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 flex-grow overflow-auto">
          {activeProblem ? (
            renderActiveTab()
          ) : (
            <div className="text-center text-gray-400">
              No active problem. Please create or select a problem.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default withErrorBoundary(ConsultingTool)