"use client"

import * as React from "react"
import {usePathname} from "next/navigation"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator"
import {cn} from "@/lib/utils"
import LanguageSwitcher from "../LanguageSwitcher"
interface SiteHeaderProps {
  className?: string
}

function SidebarHeader({className}: SiteHeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const relevantSegment = segments[2] ?? ""
  const title = relevantSegment || "dashboard"

  return (
    <header
      className={cn(
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
        className
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          {title}
        </h1>
      </div>
      <div className="px-0 lg:px-4">
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export {SidebarHeader}
