import * as React from "react"
import {cn} from "@/lib/utils"

interface NoResultsPropsTable extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description?: string
}

export function NoResultsTable({
  icon,
  title,
  description,
  className,
  ...props
}: NoResultsPropsTable) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-base font-semibold">{title}</div>
      {description && <div className="text-sm text-center">{description}</div>}
    </div>
  )
}
