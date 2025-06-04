import {Skeleton} from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm w-[384px] h-[455px]">
      <Skeleton className="h-48 bg-gray-200 rounded mb-4" />
      <Skeleton className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <Skeleton className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
      <Skeleton className="h-5 bg-gray-200 rounded w-24" />
    </div>
  )
}
