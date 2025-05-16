import {Skeleton} from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4">
            {/* Top bar: Search + Add Button */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-36" />
            </div>

            {/* Table Skeleton */}
            <div className="space-y-2 rounded-md border border-border p-4">
              {/* Header row */}
              <div className="flex gap-4 pb-2 border-b border-border">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/12" />
              </div>

              {/* Rows */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-4 py-2 items-center">
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/12" />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-4 flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
