"use client"

interface RequiredMarkProps {
  label?: string // Default: "REQUIRED"
  style?: "badge" | "star" | "text" // Choose how to display
}

export default function RequiredMark({
  label = "REQUIRED",
  style = "badge",
}: RequiredMarkProps) {
  if (style === "star") {
    return (
      <span
        title="This field is required"
        className=" text-red-600 align-middle text-sm"
      >
        *
      </span>
    )
  }

  if (style === "text") {
    return (
      <span
        title="This field is required"
        className=" text-xs font-medium text-red-600 align-middle"
      >
        {label}
      </span>
    )
  }

  // Default: badge
  return (
    <span
      title="This field is required"
      className="inline-flex items-center justify-center text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded align-middle"
    >
      {label}
    </span>
  )
}
