import React from 'react'
import ProblemTab from '@/components/tabs/ProblemTab'
import DecompositionTab from '@/components/tabs/DecompositionTab'
import AssumptionsTab from '@/components/tabs/AssumptionsTab'
import ProgressTab from '@/components/tabs/ProgressTab'

interface ConsultingToolProps {
  activeTab: string
}

export default function ConsultingTool({ activeTab }: ConsultingToolProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {activeTab === 'problem' && <ProblemTab />}
      {activeTab === 'decomposition' && <DecompositionTab />}
      {activeTab === 'assumptions' && <AssumptionsTab />}
      {activeTab === 'progress' && <ProgressTab />}
    </div>
  )
}