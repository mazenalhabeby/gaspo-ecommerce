import {Skeleton} from "@/components/ui/skeleton"

export default async function Loading() {
  return (
    <div className="mx-auto px-4 py-10 space-y-10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Product Details */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />

          {/* Category Selector */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />

          {/* Shipping & Delivery */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Skeleton className="h-[200px] w-full rounded-md" />

          {/* Pricing */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />

          {/* Inventory Inputs */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />

          {/* Variant Manager */}
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Footer Button */}
      <div className="flex justify-end pt-8 border-t">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  )
}
