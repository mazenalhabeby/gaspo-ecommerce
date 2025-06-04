"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse my-4 mx-6">
      <div className="flex flex-col gap-1 w-48 ">
        <Skeleton className="h-6 w-full my-4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Gallery */}
        <div className="col-span-1 lg:col-span-2 flex flex-row gap-4">
          <div className="flex flex-col gap-2 ">
            {Array.from({length: 4}).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>

        {/* Info Box */}
        <div className="col-span-1 space-y-6 border p-6 rounded-lg shadow-md bg-white sticky top-28 ">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Details section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Reviews section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            {Array.from({length: 5}).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="md:col-span-2 space-y-4">
            {Array.from({length: 3}).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
