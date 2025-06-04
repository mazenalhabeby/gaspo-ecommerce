import React from "react"
import Image from "next/image"
import {Trash2} from "lucide-react"
import QuantityInput from "@/components/QuantityInput"

interface CartItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

interface CartItemSectionProps {
  items: CartItem[]
  removeFromCart: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
}

const CartItemsSection = ({
  items,
  removeFromCart,
  setQuantity,
  selectedItems,
  setSelectedItems,
}: CartItemSectionProps) => {
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }
  return (
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
                {/* <p className="text-sm text-gray-500 line-through">
                  ${(item.price * 1.4).toFixed(2)}
                </p> */}
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
    </section>
  )
}

export default CartItemsSection
