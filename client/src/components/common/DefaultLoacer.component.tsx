import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CustomLoaderProps {
  className?: string
  rows?: number
  showImage?: boolean
}

export default function DefaultLoader({ className, rows = 3, showImage = true }: CustomLoaderProps = {}) {
  return (
    <div className={cn("w-full mx-auto", className)} role="status" aria-label="Loading content">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
        {showImage && <Skeleton className="h-48 w-full rounded-lg" />}
      </div>
    </div>
  )
}