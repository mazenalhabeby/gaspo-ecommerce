"use client"

import {LinkButton} from "@/components/ui/link-button"
import {useCategory} from "@/hooks/use-categories"
import {Routes} from "@/lib/routes"
import {beautifySlug, formatDate} from "@/lib/utils"
import {PencilIcon} from "lucide-react"
import Image from "next/image"
import React from "react"
import CategoryPageSkeleton from "../../components/loading/CategoryPageSkeleton"
import {NotFoundView} from "@/components/NotFoundView"
import {logo} from "@/assets"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

export default function CategoryClientPage({slug}: {slug: string}) {
  const {data: category, isLoading, error} = useCategory(slug)

  const languages = useSupportedLanguages()

  if (isLoading) {
    return <CategoryPageSkeleton />
  }

  if (error) {
    return (
      <NotFoundView
        title={`Category not found for "${slug}"`}
        message="Try checking the category name or go back to the categories list."
        icon={
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={120}
            className="grayscale opacity-80"
          />
        }
        href={Routes.dashboard.categories}
        hrefLabel="Back to Categories"
      />
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-screen-xl mx-auto p-6 space-y-8">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{beautifySlug(slug)}</h1>
            <p className="text-sm text-muted-foreground">{category?.slug}</p>
          </div>
          <LinkButton
            href={Routes.dashboard.categoryEdit(slug)}
            icon={<PencilIcon className="h-4 w-4" />}
            label="Edit category"
            className="ml-2 md:ml-0"
            variant="default"
            size="sm"
          />
        </div>
        <Tabs defaultValue={languages[0].code} className="w-full">
          <TabsList className="mb-4">
            {languages.map((lang) => (
              <TabsTrigger key={lang.code} value={lang.code}>
                {lang.label.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {languages.map((lang, index) => (
            <TabsContent key={lang.code} value={lang.code}>
              <section className="border p-4 rounded-md bg-white max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                  <Image
                    src={category?.imageUrl || "/placeholder.png"}
                    alt={category?.translations[index]?.name || "category"}
                    width={100}
                    height={100}
                    className="rounded-md object-cover border w-24 h-24"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">
                      {category?.translations[index]?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category?.translations[index]?.description ||
                        "No description"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs space-y-1 text-muted-foreground break-all flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p>ID: {category?.id}</p>
                    <p>
                      Parent ID:{" "}
                      <span className="font-medium">
                        {category?.parentId || "No Parent"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Created at:{" "}
                      {formatDate(category?.createdAt, {format: "medium"})}
                    </p>
                    <p>
                      Updated at:{" "}
                      {formatDate(category?.updatedAt, {format: "medium"})}
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* <div className="flex flex-col gap-4 p-4">
        <DataTable
          columns={CategoryColumns}
          data={[]}
          searchableColumns={["name"]}
          enableRowSelection
          noResults={<NoProductResults />}
        />
      </div> */}
    </main>
  )
}
