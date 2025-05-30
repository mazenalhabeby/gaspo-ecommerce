"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function CategoryFormSkeleton() {
  return (
    <main className="w-full max-w-screen-xl px-4 py-10 space-y-10">
      {/* Top Bar / Heading */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Form layout (2 columns on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Details Form Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-6 border-t">
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
    </main>
  )
}
