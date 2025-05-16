"use client"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ListOrdered,
} from "lucide-react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import clsx from "clsx"

const links = [
  {name: "Dashboard", href: "/admin", icon: LayoutDashboard},
  {name: "Products", href: "/admin/products", icon: Package},
  {name: "Orders", href: "/admin/orders", icon: ShoppingCart},
  {name: "Categories", href: "/admin/categories", icon: ListOrdered},
  {name: "Settings", href: "/admin/settings", icon: Settings},
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white shadow-sm border-r hidden md:block">
      <div className="p-6 text-xl font-bold">Admin Panel</div>
      <nav className="space-y-1 px-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-md text-sm font-medium",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <button className="flex items-center gap-2 w-full text-red-500 text-sm hover:bg-red-100 p-3 rounded-md">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
