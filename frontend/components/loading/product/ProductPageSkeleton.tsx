"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function ProductPageSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-screen-xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-md" />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({length: 4}).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Overview */}
            <section className="border p-4 rounded-md bg-white space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </section>

            {/* Pricing */}
            <section className="border p-4 rounded-md bg-white space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-24" />
            </section>

            {/* Variants */}
            <section className="border p-4 rounded-md bg-white space-y-4">
              <Skeleton className="h-5 w-28" />
              {Array.from({length: 2}).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-md p-3 bg-muted space-y-2"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
