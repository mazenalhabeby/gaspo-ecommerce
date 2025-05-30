import {Routes} from "@/lib/routes"
import {
  LayoutDashboardIcon,
  UsersIcon,
  ScanBarcodeIcon,
  ShoppingCartIcon,
  ChartColumnStackedIcon,
  ContainerIcon,
  SettingsIcon,
  PlusCircleIcon,
} from "lucide-react"

const SidebarMainLinks = [
  {
    title: "Dashboard",
    url: Routes.dashboard.dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    title: "Categories",
    url: Routes.dashboard.categories,
    icon: ChartColumnStackedIcon,
  },
  {
    title: "Products",
    url: Routes.dashboard.products,
    icon: ScanBarcodeIcon,
  },
  {
    title: "Orders",
    url: Routes.dashboard.orders,
    icon: ShoppingCartIcon,
  },
  {
    title: "Shipping",
    url: Routes.dashboard.shipping,
    icon: ContainerIcon,
  },
  {
    title: "Users",
    url: Routes.dashboard.users,
    icon: UsersIcon,
  },
]

const SidebarSecondaryLinks = [
  {
    title: "Settings",
    url: Routes.dashboard.settings,
    icon: SettingsIcon,
  },
]

const QuickCreateItems = [
  {
    title: "Add Product",
    url: Routes.dashboard.productCreate,
    icon: PlusCircleIcon,
  },
  {
    title: "Add Category",
    url: Routes.dashboard.categoryCreate,
    icon: PlusCircleIcon,
  },
]

//TODO: this is just for testing will be replaced with real user data
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
}
export {SidebarMainLinks, SidebarSecondaryLinks, user, QuickCreateItems}
export type SidebarMainLinkType = (typeof SidebarMainLinks)[number]
export type SidebarSecondaryLinkType = (typeof SidebarSecondaryLinks)[number]
export type QuickCreateItemType = (typeof QuickCreateItems)[number]
