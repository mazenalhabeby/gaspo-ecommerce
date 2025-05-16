import {useCartStore} from "@/store/cartStore"

export default function OrderSummary() {
  const {items} = useCartStore()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const delivery = 49

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Summary</h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Products</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${delivery}</span>
        </div>
      </div>
      <hr />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${(total + delivery).toFixed(2)}</span>
      </div>
    </div>
  )
}
