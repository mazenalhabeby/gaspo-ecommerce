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
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>

        {/* Category Details Section */}
        <section className="border p-4 rounded-md bg-white max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            <Skeleton className="w-24 h-24 rounded-md" />
            <Skeleton className="h-4 w-full md:w-3/4" />
          </div>
          <div className="mt-4 text-xs space-y-1 text-muted-foreground break-all flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
