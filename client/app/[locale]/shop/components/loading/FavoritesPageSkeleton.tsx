"use client"

import {Skeleton} from "@/components/ui/skeleton"

export default function FavoritesPageSkeleton({count = 3}: {count?: number}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh_-_210px)] w-full">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />

        {Array.from({length: count}).map((_, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4"
          >
            <Skeleton className="w-[100px] h-[100px] rounded object-cover border" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
