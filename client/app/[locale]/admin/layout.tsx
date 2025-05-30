import {SidebarHeader} from "@/components/ui/sidebar-header"
import {Breadcrumbs} from "@/components/ui/bread-crumbs"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import React from "react"
import {
  SidebarActionBtns,
  SidebarContents,
  SidebarContentsGroup,
  SidebarLogo,
  SidebarUser,
} from "./components"
import {SidebarMainLinks, SidebarSecondaryLinks, user} from "./data"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <SidebarContents
        logo={<SidebarLogo />}
        sidebarGroups={[
          {
            position: "top",
            content: <SidebarActionBtns />,
          },
          {
            position: "top",
            content: (
              <SidebarContentsGroup
                items={SidebarMainLinks}
                key="admin-main-sidebar-group"
              />
            ),
          },
          {
            position: "bottom",
            content: (
              <SidebarContentsGroup
                items={SidebarSecondaryLinks}
                key="admin-secondary-sidebar-group"
              />
            ),
          },
        ]}
        variant="inset"
        user={<SidebarUser user={user} />}
      />
      <SidebarInset>
        <SidebarHeader />
        <Breadcrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
