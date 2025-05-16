"use client"

import {usePathname} from "next/navigation"
import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"

export function SiteHeader({name}: {name?: string}) {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  // Find the last part after /en/admin/*
  const relevantSegment = segments[2] ?? "" // segments[0] = "en", [1] = "admin", [2] = "products", etc.

  const derivedName = !relevantSegment
    ? "Dashboard"
    : capitalize(relevantSegment)

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm font-medium uppercase text-muted-foreground tracking-wider">
          {name || derivedName}
        </h1>
      </div>
    </header>
  )
}

function capitalize(input: string) {
  return input
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
