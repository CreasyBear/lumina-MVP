import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TreeNodeProps {
  label: string
  content?: string
  children?: React.ReactNode
}

export const TreeNode: React.FC<TreeNodeProps> = ({ label, content, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const hasChildren = React.Children.count(children) > 0

  return (
    <div className="ml-4">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {hasChildren && (
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <span className="font-medium">{label}</span>
      </div>
      {isOpen && (
        <div className="ml-4 mt-1">
          {content && <pre className="text-sm bg-gray-100 p-2 rounded">{content}</pre>}
          {children}
        </div>
      )}
    </div>
  )
}

export const Tree: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mt-2">{children}</div>
}