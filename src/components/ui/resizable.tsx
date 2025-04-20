// This is a stub to fix the ref issue in the resizable component
// Replace with a proper implementation if needed

// The original file seems to have an issue with refs
// Let's create a minimal version that works with refs

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any props needed for your resizable components
}

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative h-full w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ResizablePanel.displayName = "ResizablePanel"

export { 
  ResizablePanel
}
