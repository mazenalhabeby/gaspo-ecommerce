import {useCartStore} from "@/store/cartStore"
import Image from "next/image"

export default function Step3_Overview({onBack}: {onBack: () => void}) {
  const {items, clearCart} = useCartStore()

  const handleConfirm = () => {
    clearCart()
    alert("Order placed successfully!")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Order Overview</h2>

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

      <div className="flex justify-between gap-4 pt-4">
        <button onClick={onBack} className="btn-secondary w-full">
          Back
        </button>
        <button onClick={handleConfirm} className="btn-primary w-full">
          Confirm Order
        </button>
      </div>
    </div>
  )
}
