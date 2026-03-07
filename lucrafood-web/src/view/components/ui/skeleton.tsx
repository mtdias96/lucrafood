import * as React from "react"
import { cn } from "@/app/utils/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
