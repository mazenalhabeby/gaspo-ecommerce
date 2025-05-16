"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {ChevronRight} from "lucide-react"
import {cn} from "@/lib/utils"
import {dummyProducts} from "@/data/dummyProductData"

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({className}: BreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [resolvedName, setResolvedName] = useState<string | null>(null)

  // Get locale + cleaned path
  const [locale, ...cleanedSegments] = segments

  const isProductRoute = cleanedSegments.includes("products")
  const idIndex = cleanedSegments.findIndex((seg) =>
    /^prod_[a-zA-Z0-9]+$/.test(seg)
  )

  useEffect(() => {
    if (isProductRoute && idIndex !== -1) {
      const productId = cleanedSegments[idIndex]
      const product = dummyProducts.find((p) => p.id === productId)
      if (product) setResolvedName(product.name)
    }
  }, [cleanedSegments, isProductRoute, idIndex])

  const breadcrumbSegments = cleanedSegments.map((seg, i) => {
    const href = "/" + cleanedSegments.slice(0, i + 1).join("/")

    let label = seg === "admin" ? "Dashboard" : beautify(seg)

    // Replace only the product ID segment with the resolved product name
    if (i === idIndex && resolvedName) {
      label = resolvedName
    }

    return {
      label,
      href,
    }
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
  return slug.replace(/[-_]/g, " ")
}
