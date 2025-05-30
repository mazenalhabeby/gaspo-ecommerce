"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {ChevronRight} from "lucide-react"
import {beautifySlug, cn} from "@/lib/utils"

interface BreadcrumbsProps {
  className?: string
  resolveName?: (
    slug: string
  ) => Promise<string | undefined> | string | undefined
}

export function Breadcrumbs({className, resolveName}: BreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [resolvedNames, setResolvedNames] = React.useState<
    Record<string, string>
  >({})

  const [locale, ...cleanedSegments] = segments

  React.useEffect(() => {
    const resolveAll = async () => {
      if (!resolveName) return
      const entries = await Promise.all(
        cleanedSegments.map(async (seg) => {
          const name = await resolveName(seg)
          return name ? [seg, name] : null
        })
      )
      const resolved = Object.fromEntries(
        entries.filter(Boolean) as [string, string][]
      )
      setResolvedNames(resolved)
    }

    resolveAll()
  }, [pathname, resolveName, cleanedSegments])

  const breadcrumbs = cleanedSegments.map((seg, idx) => {
    const href = "/" + cleanedSegments.slice(0, idx + 1).join("/")
    const label =
      resolvedNames[seg] ?? (seg === "admin" ? "Dashboard" : beautifySlug(seg))

    return {href, label}
  })

  return (
    <nav
      className={cn(
        "flex items-center gap-1 px-6 py-4 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1
        const fullHref = `/${locale}${crumb.href}`

        return (
          <div key={fullHref} className="flex items-center">
            {!isLast ? (
              <>
                <Link
                  href={fullHref}
                  className="capitalize transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
              </>
            ) : (
              <span className="capitalize text-foreground">{crumb.label}</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
