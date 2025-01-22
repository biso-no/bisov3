"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
          "transition-all duration-200 ease-in-out",
          "shadow-sm hover:shadow-md",
          "bg-gradient-to-b from-background to-background/5",
          "placeholder:text-muted-foreground/60",
          "hover:border-primary/30",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }