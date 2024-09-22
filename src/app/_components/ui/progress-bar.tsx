import * as React from "react"

import { cn } from "@/app/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ progress, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full h-4 bg-gray-200 rounded-full", className)}
        {...props}
      >
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }