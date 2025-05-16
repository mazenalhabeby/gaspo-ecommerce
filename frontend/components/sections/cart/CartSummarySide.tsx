import Link from "next/link"
import React from "react"

interface CartSummarySideProps {
  itemsTotal: number
  deliveryCost: number
  grandTotal: number
  selectedItems: string[]
}

const CartSummarySide = ({
  itemsTotal,
  deliveryCost,
  grandTotal,
  selectedItems,
}: CartSummarySideProps) => {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-gray-50 border rounded-lg p-6 shadow-sm space-y-6 sticky top-28">
        <h2 className="text-lg font-semibold">🧾 Order Summary</h2>

        <div className="space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Items</span>
            <span>${itemsTotal.toFixed(2)}</span>
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
  )
}

export default CartSummarySide
