"use client"

import {Button} from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {PencilIcon, LayersIcon} from "lucide-react"
import React, {use} from "react"
import {dashboardRoutes} from "@/lib/routes"
import {useCategory} from "@/hooks/categories/useCategories"
import {formatDate} from "@/lib/formatDate"
import CategoryPageSkeleton from "@/components/loading/category/CategoryPageSkeleton"
import {DataTable} from "@/components/admin/data-table"
import {CategoryColumns} from "@/components/admin/category/CategoryColums"
import {NoProductResults} from "@/components/not-found/NoResults"
import CategoryNotFound from "@/components/not-found/CategoryNotFound"

export default function CategoryPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  const {data: category, isLoading} = useCategory(slug)
  if (isLoading) {
    return <CategoryPageSkeleton />
  }

  if (!category) {
    return <CategoryNotFound slug={slug} />
  }

  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-xl mx-auto p-6 space-y-8">
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{category?.name}</h1>
              <p className="text-sm text-muted-foreground">{category?.slug}</p>
            </div>

            <Button
              variant="default"
              className="bg-primary text-primary-foreground"
              asChild
            >
              <Link href={dashboardRoutes.categoryEdit(slug)}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-6 items-stretch">
            {/* Image */}
            <div className="h-full">
              <div className="border p-4 rounded-md bg-white h-full flex items-center justify-center">
                <Image
                  src={category?.imageUrl || "/placeholder.png"}
                  alt={category?.name || "category"}
                  width={100}
                  height={100}
                  className="rounded-md object-cover border w-24 h-24"
                />
              </div>
            </div>

            {/* Overview */}
            <section className="border p-4 rounded-md bg-white h-full">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p>{category?.description}</p>
              <div className="mt-4 text-sm space-y-1 text-muted-foreground break-all">
                <p>
                  <LayersIcon className="inline w-4 h-4 mr-1" />
                  ID: {category?.id}
                </p>
                <p>
                  Parent ID:{" "}
                  <span className="font-medium">
                    {category?.parentId ? category.parentId : "No Parent"}
                  </span>
                </p>
              </div>
            </section>

            {/* Timestamps */}
            <section className="border p-4 rounded-md bg-white h-full">
              <h2 className="text-lg font-semibold mb-2">Timestamps</h2>
              <p className="text-sm text-muted-foreground">
                Created at:{" "}
                {formatDate(category?.createdAt, {format: "medium"})}
              </p>
              <p className="text-sm text-muted-foreground">
                Updated at:{" "}
                {formatDate(category?.updatedAt, {format: "medium"})}
              </p>
            </section>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <DataTable
            columns={CategoryColumns}
            data={[]}
            searchableColumns={["name"]}
            enableRowSelection
            noResults={<NoProductResults />}
          />
        </div>
      </main>
    </React.Fragment>
  )
}
