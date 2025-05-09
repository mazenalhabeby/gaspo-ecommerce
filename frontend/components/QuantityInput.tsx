"use client"

import {useState} from "react"

type Props = {
  quantity: number
  onChange: (newQty: number) => void
  label?: string
  min?: number
  max?: number
}

export default function QuantityInput({
  quantity,
  onChange,
  label = "Menge:",
  min = 1,
  max = 99,
}: Props) {
  const [internalQty, setInternalQty] = useState(quantity)

  const updateQty = (newQty: number) => {
    const validQty = Math.max(min, Math.min(max, newQty))
    setInternalQty(validQty)
    onChange(validQty)
  }

  return (
    <div className="flex gap-2 items-center mt-2">
      <label className="text-sm">{label}</label>
      <div className="flex items-center border rounded">
        <button
          onClick={() => updateQty(internalQty - 1)}
          className="px-3 py-1 text-lg"
        >
          −
        </button>
        <input
          type="number"
          value={internalQty}
          onChange={(e) => updateQty(Number(e.target.value))}
          className="w-12 text-center border-l border-r outline-none"
          min={min}
          max={max}
        />
        <button
          onClick={() => updateQty(internalQty + 1)}
          className="px-3 py-1 text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
