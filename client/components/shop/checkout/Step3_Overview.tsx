"use client"

import {useCheckoutStore} from "@/store/checkoutStore"
import {useCartStore} from "@/store/cartStore"
import Image from "next/image"

export default function Step3_Overview() {
  const {user, address} = useCheckoutStore()
  const {items} = useCartStore()

  const deliveryCost = 0
  const itemsTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const grandTotal = itemsTotal + deliveryCost

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Order Overview</h2>

      {/* Customer Info */}
      <section className="border p-4 rounded-md">
        <h3 className="font-semibold mb-2">Customer</h3>
        <p>{user.name}</p>
        <p>{user.phone}</p>
        <p>{user.email}</p>
      </section>

      {/* Address Info */}
      <section className="border p-4 rounded-md">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <p>{address.line}</p>
        <p>
          {address.zip} {address.city}, {address.country}
        </p>
        {address.note && (
          <p className="text-sm text-gray-500">Note: {address.note}</p>
        )}
      </section>

      {/* Cart Items */}
      <section className="space-y-4">
        <h3 className="font-semibold">Items</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Image
              src={item.image}
              alt={item.name}
              width={60}
              height={60}
              className="rounded border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500 text-sm">
                Qty: {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </section>

      {/* Summary */}
      <section className="border-t pt-4 space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Items Total</span>
          <span>${itemsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${deliveryCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </section>
    </div>
  )
}
