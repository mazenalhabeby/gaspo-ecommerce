import {dashboardRoutes} from "@/lib/routes"
import {
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  ScanBarcodeIcon,
  ShoppingCartIcon,
  ChartColumnStackedIcon,
  ContainerIcon,
} from "lucide-react"

const navMain = [
  {
    title: "Dashboard",
    url: dashboardRoutes.dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    title: "Products",
    url: dashboardRoutes.products,
    icon: ScanBarcodeIcon,
  },
  {
    title: "Orders",
    url: dashboardRoutes.orders,
    icon: ShoppingCartIcon,
  },
  {
    title: "Categories",
    url: dashboardRoutes.categories,
    icon: ChartColumnStackedIcon,
  },
  {
    title: "Shipping",
    url: dashboardRoutes.shipping,
    icon: ContainerIcon,
  },
  {
    title: "Users",
    url: dashboardRoutes.users,
    icon: UsersIcon,
  },
]
const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
]

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
}

export {navMain, navSecondary, user}
export type NavMainItem = (typeof navMain)[number]
export type NavSecondaryItem = (typeof navSecondary)[number]
export type User = typeof user
