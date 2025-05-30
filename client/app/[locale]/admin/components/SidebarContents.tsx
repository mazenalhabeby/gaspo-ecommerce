import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {cn} from "@/lib/utils"
import {ArrowUpCircleIcon} from "lucide-react"
import Link from "next/link"
import React from "react"

type SidebarGroupType = {
  position?: "top" | "bottom"
  content: React.ReactNode
}

interface SidebarContentsProps extends React.ComponentProps<typeof Sidebar> {
  logo?: React.ReactNode
  logoHref?: string
  sidebarGroups: SidebarGroupType[]
  user?: React.ReactNode
}

export const SidebarContents = ({
  logo,
  logoHref,
  sidebarGroups,
  user,
  className,
  ...props
}: SidebarContentsProps) => {
  const topGroups = sidebarGroups.filter((g) => g.position !== "bottom")
  const bottomGroups = sidebarGroups.filter((g) => g.position === "bottom")
  return (
    <Sidebar collapsible="offcanvas" className={cn(className)} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={logoHref || "/"}>
                {logo || (
                  <React.Fragment>
                    <ArrowUpCircleIcon className="h-5 w-5" />
                    <span className="text-base font-semibold">Logo</span>
                  </React.Fragment>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {topGroups.map((group, i) => (
          <React.Fragment key={`top-${i}`}>{group.content}</React.Fragment>
        ))}

        {/* Push bottom content to bottom using flex-grow */}
        <div className="mt-auto">
          {bottomGroups.map((group, i) => (
            <React.Fragment key={`bottom-${i}`}>{group.content}</React.Fragment>
          ))}
        </div>
      </SidebarContent>

      {user && <SidebarFooter>{user}</SidebarFooter>}
    </Sidebar>
  )
}
