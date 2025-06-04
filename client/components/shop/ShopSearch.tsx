"use client"

export default function ShopSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-64 border rounded px-4 py-2 mb-4"
    />
  )
}
