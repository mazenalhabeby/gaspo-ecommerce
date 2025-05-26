"use client"

import {useEffect, useState, ReactNode} from "react"
import Link from "next/link"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"
import DropdownItem from "@/components/DropdownItem"

type Item = {
  id: string
  name: string
  image: string
  price?: number
  quantity?: number
  slug: string
}

type ItemSheetPanelProps = {
  icon: ReactNode
  title: string
  discription?: string
  items: Item[]
  badgeColor?: string // Tailwind class e.g. "bg-blue-600"
  emptyMessage: ReactNode
  linkHref: string
  linkLabel: string
  onRemove: (id: string) => void
  onQuantityChange?: (id: string, qty: number) => void
}

export default function ItemSheetPanel({
  icon,
  title,
  discription,
  items,
  badgeColor = "bg-blue-600",
  emptyMessage,
  linkHref,
  linkLabel,
  onRemove,
  onQuantityChange,
}: ItemSheetPanelProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const wrapper = document.getElementById("app-blur-wrapper")
    if (!wrapper) return

    wrapper.classList.toggle("blur-sm", open)
    wrapper.classList.toggle("brightness-[0.7]", open)
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative cursor-pointer">
          {icon}
          {items.length > 0 && (
            <span
              className={`absolute -top-2 -right-2 ${badgeColor} text-white text-xs w-5 h-5 flex items-center justify-center rounded-full`}
            >
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[90vw] sm:w-[400px] p-4 z-[105]">
        <SheetHeader>
          <SheetTitle>
            {title}{" "}
            {items.length > 0 && (
              <span className="text-sm text-gray-500">({items.length})</span>
            )}
          </SheetTitle>
          <SheetDescription>{discription}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {items.length === 0
            ? emptyMessage
            : items.map((item) => (
                <DropdownItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  quantity={item.quantity}
                  linkTo={`/shop/${item.slug}`}
                  onRemove={() => onRemove(item.id)}
                  onQuantityChange={
                    onQuantityChange
                      ? (qty) => onQuantityChange(item.id, qty)
                      : undefined
                  }
                />
              ))}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-6">
            <Link
              href={linkHref}
              onClick={() => setOpen(false)}
              className={`block w-full text-center ${badgeColor} hover:brightness-90 text-white font-medium py-2 rounded transition`}
            >
              {linkLabel}
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
