"use client"

import {useState, useEffect, useMemo, Fragment} from "react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command"
import {Search} from "lucide-react"
import {products} from "@/data/products"
import {useRecentSearchStore} from "@/store/recentSearchStore"
import Link from "next/link"
import Image from "next/image"
import {shoppingRoutes} from "@/lib/routes"

export default function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const {recent, addRecent, clearRecent} = useRecentSearchStore()

  const query = useMemo(() => search.toLowerCase().trim(), [search])

  const searchResults = useMemo(() => {
    return query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : []
  }, [query])

  const recentProducts = useMemo(() => {
    return recent
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as typeof products
  }, [recent])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (id: string) => {
    addRecent(id)
    setSearch("")
    setOpen(false)
  }

  const renderProductItem = (product: (typeof products)[number]) => (
    <CommandItem key={product.id} onSelect={() => handleSelect(product.id)}>
      <Link
        href={shoppingRoutes.product(product.id)}
        className="flex items-center gap-3 w-full"
      >
        <Image
          src={product.image}
          alt={product.name}
          width={48}
          height={48}
          className="rounded-md border w-12 h-12 object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-gray-500">{product.category}</p>
        </div>
        <span className="text-sm font-semibold text-primary">
          ${product.price.toFixed(2)}
        </span>
      </Link>
    </CommandItem>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-gray-700 px-3 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 transition"
      >
        <Search size={16} />
        <kbd className="ml-2 hidden md:inline text-xs text-gray-400 border border-gray-300 rounded px-1">
          Ctrl + K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setSearch("")
        }}
      >
        <CommandInput
          placeholder="Search products..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="min-h-[120px] px-2">
          {query ? (
            <>
              {searchResults.length > 0 && (
                <CommandGroup heading="Search Results">
                  {searchResults.map(renderProductItem)}
                </CommandGroup>
              )}

              {searchResults.length === 0 && (
                <CommandEmpty className="py-6 text-sm text-gray-500 text-center">
                  No results found. Try a different keyword.
                </CommandEmpty>
              )}
            </>
          ) : (
            <>
              <CommandGroup heading="Recent Searches">
                {recentProducts.length > 0 ? (
                  <>
                    {recentProducts.map(renderProductItem)}
                    <CommandItem
                      onSelect={clearRecent}
                      className="text-red-500 hover:bg-red-50 mt-2"
                    >
                      Clear recent searches
                    </CommandItem>
                  </>
                ) : (
                  <div className="px-4 py-6 text-sm text-gray-500 text-center w-full">
                    No recent searches yet.
                  </div>
                )}
              </CommandGroup>

              <CommandGroup heading="Search Tips">
                <CommandItem
                  disabled
                  className="flex flex-col items-start leading-tight"
                >
                  <span className="text-sm text-muted-foreground tracking-wider">
                    <span className="font-bold">Example</span>: Chair, Desk, or
                    Lamp
                  </span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
