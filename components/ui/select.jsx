import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

// Styled native <select>: keeps the platform picker on mobile and full keyboard support.
const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-10 w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
    />
  </div>
))
Select.displayName = "Select"

export { Select }
