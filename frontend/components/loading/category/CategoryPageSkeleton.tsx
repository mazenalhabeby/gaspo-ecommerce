"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function CategoryPageSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-screen-xl mx-auto p-6 space-y-8">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-6 items-stretch">
          {/* Image */}
          <div className="h-full">
            <div className="border p-4 rounded-md bg-white h-full flex items-center justify-center">
              <Skeleton className="w-24 h-24 rounded-md" />
            </div>
          </div>

          {/* Overview */}
          <section className="border p-4 rounded-md bg-white h-full space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </section>

          {/* Timestamps */}
          <section className="border p-4 rounded-md bg-white h-full space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </section>
        </div>
      </div>
    </main>
  )
}
