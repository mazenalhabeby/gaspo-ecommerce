"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function CartPageSkeleton({count = 2}: {count?: number}) {
  return (
    <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh_-_210px)] lg:px-12">
      {/* Left: Cart Items Skeleton */}
      <section className="lg:col-span-2 space-y-6">
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        {Array.from({length: count}).map((_, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-[100px] h-[100px] rounded border" />
            </div>

            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ))}
      </section>

      {/* Right: Summary Skeleton */}
      <aside className="lg:col-span-1">
        <div className="bg-gray-50 border rounded-lg p-6 shadow-sm space-y-4 sticky top-28">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-px bg-gray-200" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    </main>
  )
}
