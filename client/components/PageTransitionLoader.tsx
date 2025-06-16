// components/PageTransitionLoader.tsx
"use client"

import {useEffect} from "react"
import {usePathname} from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({showSpinner: false, speed: 300})

export function PageTransitionLoader() {
  const pathname = usePathname()

  useEffect(() => {
    // Normalize the pathname to remove trailing slashes
    NProgress.done()
  }, [pathname])

  return null
}
