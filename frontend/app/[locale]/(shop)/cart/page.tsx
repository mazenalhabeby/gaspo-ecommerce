"use client"

import {useCartStore} from "@/store/cartStore"
import {useState, useMemo} from "react"
import Image from "next/image"
import Link from "next/link"
import {Trash2} from "lucide-react"
import {FiShoppingCart} from "react-icons/fi"
import QuantityInput from "@/components/QuantityInput"

export default function CartPage() {
  const {items, removeFromCart, setQuantity} = useCartStore()
  const [insurance, setInsurance] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>(
    items.map((item) => item.id)
  )

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selected = useMemo(
    () => items.filter((item) => selectedItems.includes(item.id)),
    [items, selectedItems]
  )

  const deliveryCost = 49
  const servicesCost = insurance ? 139.9 : 0
  const itemsTotal = selected.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const grandTotal = itemsTotal + deliveryCost + servicesCost

  return (
    <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh_-_210px)]">
      {items.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 text-center">
          <FiShoppingCart className="text-gray-400 w-16 h-16" />
          <p className="text-gray-500 text-sm">No items in your cart yet.</p>
          <Link
            href="/shop"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="col-span-full lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <section className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">🛒 Your Cart</h1>
              <p className="text-gray-500 text-sm">
                Items in your cart are not reserved.
              </p>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4"
              >
                <div className="flex flex-row gap-4 items-center">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.name}`}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-5 h-5"
                  />
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded object-cover border"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500 line-through">
                        ${(item.price * 1.4).toFixed(2)}
                      </p>
                      <p className="text-lg text-red-600 font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <QuantityInput
                    quantity={item.quantity}
                    onChange={(newQty) => setQuantity(item.id, newQty)}
                  />
                </div>
              </div>
            ))}

            {/* Insurance */}
            <div className="border p-4 rounded-md">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={() => setInsurance(!insurance)}
                  className="w-5 h-5"
                />
                <span>
                  5-Year Extended Warranty
                  <span className="ml-2 text-gray-500">
                    + ${servicesCost.toFixed(2)}
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 border rounded-lg p-6 shadow-sm space-y-6 sticky top-28">
              <h2 className="text-lg font-semibold">🧾 Order Summary</h2>

              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>${itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Warranty</span>
                  <span>${servicesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>${deliveryCost.toFixed(2)}</span>
                </div>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              <input
                type="text"
                placeholder="Add discount code"
                className="w-full px-4 py-2 border rounded text-sm"
              />

              <Link
                href={{
                  pathname: "/checkout",
                  query: {items: selectedItems.join(",")},
                }}
                className="block text-center bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
