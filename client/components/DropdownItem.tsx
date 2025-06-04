import Image from "next/image"
import Link from "next/link"

type DropdownItemProps = {
  id: string
  name: string
  image: string
  price?: number
  quantity?: number
  onRemove: () => void
  onQuantityChange?: (qty: number) => void
  linkTo?: string // New prop
}

export default function DropdownItem({
  name,
  image,
  price,
  quantity,
  onRemove,
  onQuantityChange,
  linkTo,
}: DropdownItemProps) {
  const content = (
    <div className="flex items-center justify-between gap-4 p-2 my-2 border rounded hover:bg-gray-50 transition">
      <Image
        width={56}
        height={56}
        src={image}
        alt={name}
        className="w-14 h-14 object-cover rounded"
      />
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        {price !== undefined && (
          <p className="text-sm text-gray-500">${price}</p>
        )}
        {onQuantityChange && quantity !== undefined && (
          <div className="text-xs mt-1">Qty: {quantity}</div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault() // Prevents link trigger if you're just removing
          onRemove()
        }}
        className="text-red-500 text-xs hover:underline"
      >
        Remove
      </button>
    </div>
  )

  return linkTo ? <Link href={linkTo}>{content}</Link> : content
}
