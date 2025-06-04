"use client"

import {useCartStore} from "@/store/cartStore"
import {FiShoppingCart} from "react-icons/fi"
import ItemSheetPanel from "../ItemSheetPanel"
import {Routes} from "@/lib/routes"

export default function CartItemsPanel() {
  const {items, removeFromCart, setQuantity} = useCartStore()

  const emptyMessage = (
    <div className="flex flex-col items-center justify-center gap-2 col-span-3">
      <FiShoppingCart className="text-gray-400 w-16 h-16" />
      <p className="text-gray-500 text-sm ">No items in the cart yet.</p>
    </div>
  )

  return (
    <ItemSheetPanel
      icon={<FiShoppingCart className="text-2xl" />}
      title="Cart Items"
      items={items}
      discription="Review and manage the items in your cart. You can remove products, or proceed to checkout when you're ready."
      badgeColor="bg-primary"
      emptyMessage={emptyMessage}
      linkHref={Routes.shopping.cart}
      linkLabel="View Cart Items"
      onRemove={removeFromCart}
      onQuantityChange={setQuantity}
    />
  )
}
