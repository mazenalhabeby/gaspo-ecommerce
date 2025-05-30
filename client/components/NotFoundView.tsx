import Link from "next/link"
import {cn} from "@/lib/utils"
import * as React from "react"

interface NotFoundViewProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  href?: string
  hrefLabel?: string
  className?: string
  children?: React.ReactNode
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  title = "Not Found",
  message = "The requested item could not be found.",
  icon,
  href,
  hrefLabel = "Go Back",
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground text-center p-6",
        className
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm">{message}</div>
      {href && (
        <Link href={href} className="text-sm text-primary underline">
          {hrefLabel}
        </Link>
      )}
      {children}
    </div>
  )
}
