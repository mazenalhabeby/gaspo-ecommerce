"use client"

import {MailIcon, PlusCircleIcon, type LucideIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {PopoverClose} from "@radix-ui/react-popover"
import {dashboardRoutes} from "@/lib/routes"

const QuickCreateItems = [
  {
    title: "Product",
    url: dashboardRoutes.productCreate,
    icon: PlusCircleIcon,
  },
  {
    title: "Category",
    url: dashboardRoutes.categoryCreate,
    icon: PlusCircleIcon,
  },
]

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger className="bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground flex items-center gap-2 px-8 py-2 rounded-md">
                <PlusCircleIcon className="h-4 w-4" />
                <span>Quick Create</span>
              </PopoverTrigger>
              <PopoverContent>
                {QuickCreateItems.map((item) => (
                  <PopoverClose asChild key={item.title}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </PopoverClose>
                ))}
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
