/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {ChevronRight} from "lucide-react"
import {cn} from "@/lib/utils"

interface BreadcrumbsProps {
  className?: string
  resolveName?: (
    slug: string
  ) => Promise<string | undefined> | string | undefined
}

export function Breadcrumbs({className, resolveName}: BreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [resolvedNames, setResolvedNames] = useState<Record<string, string>>({})

  // Remove locale (optional logic)
  const [locale, ...cleanedSegments] = segments

  useEffect(() => {
    const resolveAll = async () => {
      if (!resolveName) return
      const entries = await Promise.all(
        cleanedSegments.map(async (seg) => {
          const label = await resolveName(seg)
          return label ? [seg, label] : null
        })
      )
      const resolved = Object.fromEntries(
        entries.filter(Boolean) as [string, string][]
      )
      setResolvedNames(resolved)
    }
    resolveAll()
  }, [pathname, resolveName])

  const breadcrumbSegments = cleanedSegments.map((seg, i) => {
    const href = "/" + cleanedSegments.slice(0, i + 1).join("/")
    const label =
      resolvedNames[seg] ?? (seg === "admin" ? "Dashboard" : beautify(seg))

    return {label, href}
  })

  return (
    <nav
      className={cn(
        "flex items-center text-sm text-muted-foreground px-6 py-4",
        className
      )}
    >
      {breadcrumbSegments.map((segment, i) => {
        const isLast = i === breadcrumbSegments.length - 1
        return (
          <div className="flex items-center" key={segment.href}>
            {!isLast ? (
              <>
                <Link
                  href={`/${locale}${segment.href}`}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {segment.label}
                </Link>
                <ChevronRight className="mx-2 h-4 w-4" />
              </>
            ) : (
              <span className="capitalize text-foreground">
                {segment.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

function beautify(slug: string) {
  return slug.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase())
}
