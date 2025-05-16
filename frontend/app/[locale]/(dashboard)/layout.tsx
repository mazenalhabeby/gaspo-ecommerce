import {AppSidebar} from "@/components/layouts/sidebar/app-sidebar"
import {SiteHeader} from "@/components/layouts/site-header"
import {Breadcrumbs} from "@/components/DynamicBreadCrumbs"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Breadcrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
