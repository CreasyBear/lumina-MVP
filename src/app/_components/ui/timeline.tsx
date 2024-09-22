import React from 'react'
import { cn } from "@/app/lib/utils"
import { CheckCircle, Circle } from 'lucide-react'

interface TimelineItemProps {
  title: string
  date: string
  completed: boolean
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, completed }) => (
  <div className="flex items-center mb-4">
    {completed ? (
      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400 mr-2" />
    )}
    <div className="flex-grow">
      <h4 className="text-lg font-medium">{title}</h4>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  </div>
)

export const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-2">
    {children}
  </div>
)