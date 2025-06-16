import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {LucideIcon} from "lucide-react"
import {NProgressLink} from "@/components/NProgressLink"

type SidebarContentsItem = {
  title: string
  url: string
  icon?: LucideIcon
}

export const SidebarContentsGroup = ({
  items,
}: {
  items: SidebarContentsItem[]
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NProgressLink
                  href={item.url}
                  className="flex items-center gap-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </NProgressLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
