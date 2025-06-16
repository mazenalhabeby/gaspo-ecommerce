"use client"

import {useRouter, usePathname} from "next/navigation"
import {MouseEvent} from "react"
import NProgress from "nprogress"

interface NProgressLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NProgressLink({href, children, className}: NProgressLinkProps) {
  const router = useRouter()
  const pathname = usePathname()

  const normalizePath = (path: string) => {
    const parts = path.split("/")
    // Remove locale prefix like /en or /ar
    if (parts[1]?.length === 2) {
      return "/" + parts.slice(2).join("/")
    }
    return path
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const current = normalizePath(pathname)
    const target = normalizePath(href)

    if (current === target) return // Don't reload same route

    NProgress.start()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
