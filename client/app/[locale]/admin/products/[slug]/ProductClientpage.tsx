"use client"

import {Button} from "@/components/ui/button"
import {TagIcon, PencilIcon, ChartColumnStacked} from "lucide-react"
import React, {useState} from "react"
import {dashboardRoutes, Routes} from "@/lib/routes"
import ProductImageGallery from "@/components/ProductImageGallery"
import {useProduct} from "@/hooks/use-products"
import {NotFoundView} from "@/components/NotFoundView"
import Image from "next/image"
import {logo} from "@/assets"
import ProductPageSkeleton from "../../components/loading/ProductPageSkeleton"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {TabsContent} from "@/components/ui/tabs"
import {TranslationTabs} from "@/components/TranslationTabs"
import {beautifySlug} from "@/lib/utils"
import {NProgressLink} from "@/components/NProgressLink"

export default function ProductClientPage({slug}: {slug: string}) {
  const {data: product, isLoading, error} = useProduct(slug)
  const [mainImage, setMainImage] = useState(product?.images?.[0]?.url)

  const languages = useSupportedLanguages()

  if (isLoading) {
    return <ProductPageSkeleton />
  }

  if (!product || error) {
    return (
      <NotFoundView
        title={`Product not found for "${slug}"`}
        message="Try checking the product name or go back to the products list."
        icon={
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={120}
            className="grayscale opacity-80"
          />
        }
        href={Routes.dashboard.products}
        hrefLabel="Back to Products"
      />
    )
  }

  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-xl mx-auto p-6 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.slug}</p>
            </div>
            <Button
              variant="default"
              className=" bg-primary text-primary-foreground"
              asChild
            >
              <NProgressLink href={dashboardRoutes.productEdit(slug)}>
                <PencilIcon className="w-4 h-4" />
                Edit
              </NProgressLink>
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProductImageGallery
                mainImage={mainImage || product?.images?.[0]?.url}
                setMainImage={setMainImage}
                gallery={product.images?.map((img) => img.url)}
                productName={product.name}
              />
              <div className="space-y-4 border rounded-md p-4 bg-white">
                <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Weight:</span>{" "}
                    {product.weight} {product.weightUnit}
                  </p>
                </div>

                {Array.isArray(product.packages) &&
                  product.packages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Package Dimensions:
                      </p>

                      <div className="grid gap-3">
                        {product.packages.map(
                          (
                            pkg: {
                              length: number
                              breadth: number
                              width: number
                              unit: string
                            },
                            idx: number
                          ) => (
                            <div
                              key={idx}
                              className="p-3 bg-muted rounded-md border text-sm text-muted-foreground"
                            >
                              <p className="font-medium text-foreground mb-1">
                                Package #{idx + 1}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs">
                                <span className="bg-background px-2 py-1 rounded border">
                                  Length: {pkg.length} {pkg.unit}
                                </span>
                                <span className="bg-background px-2 py-1 rounded border">
                                  Breadth: {pkg.breadth} {pkg.unit}
                                </span>
                                <span className="bg-background px-2 py-1 rounded border">
                                  Width: {pkg.width} {pkg.unit}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Info Panels */}
            <div className="space-y-6">
              <section className="border p-4 rounded-md bg-white">
                <TranslationTabs languages={languages}>
                  {languages.map((lang, index) => (
                    <TabsContent key={index} value={lang.code}>
                      <section className="border p-4 rounded-md bg-white max-w-4xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                          <div className="flex-1">
                            <p className="text-lg font-semibold">
                              {product?.ProductTranslations?.find(
                                (t) => t.language === lang.code
                              )?.name || product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {product?.ProductTranslations?.find(
                                (t) => t.language === lang.code
                              )?.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </section>
                    </TabsContent>
                  ))}
                </TranslationTabs>
                <div className="mt-4 text-sm space-y-1 text-muted-foreground">
                  <p>
                    <TagIcon className="inline w-4 h-4 mr-1" />
                    SKU: {product.sku}
                  </p>
                  <p>
                    <ChartColumnStacked className="inline w-4 h-4 mr-1" />
                    Category:{" "}
                    {product.categories
                      ? beautifySlug(product.categories.slug)
                      : "No category assigned"}
                  </p>
                </div>
              </section>

              <section className="border p-4 rounded-md bg-white">
                <h2 className="text-lg font-semibold mb-2">Pricing</h2>
                <div className="text-xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </p>
              </section>

              {product.variants && product.variants.length > 0 && (
                <section className="space-y-4 border p-4 rounded-md bg-white">
                  <h2 className="text-lg font-semibold mb-2">Variants</h2>

                  {/* <div className="grid gap-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="p-3 bg-muted rounded-md border text-sm text-muted-foreground"
                      >
                        <p className="font-medium text-foreground mb-1">
                          {variant.name}
                        </p>
                        <p className="text-xs mb-2">
                          SKU: {variant.sku ?? "-"} | Price: $
                          {variant.price.toFixed(2)} | Stock: {variant.stock}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {variant.attributes?.map((attr) => (
                            <span
                              key={attr.id}
                              className="bg-background px-2 py-1 rounded border"
                            >
                              {attr.name}:{" "}
                              {typeof attr.value === "object"
                                ? JSON.stringify(attr.value)
                                : attr.value?.toString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <div className="grid gap-3">
                    {product.variants.map((variant) => {
                      return (
                        <div
                          key={variant.id}
                          className="p-4 bg-muted rounded-md border text-sm text-muted-foreground"
                        >
                          <p className="font-medium text-foreground mb-1">
                            {variant.name}
                          </p>
                          <p className="text-xs mb-2">
                            SKU: {variant.sku ?? "-"} | Price: $
                            {variant.price.toFixed(2)} | Stock: {variant.stock}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {variant.attributes?.map((attr) => (
                              <span
                                key={attr.id}
                                className="bg-background px-2 py-1 rounded border"
                              >
                                {typeof attr.value === "object" && (
                                  <>
                                    {`${JSON.stringify(
                                      attr.value.name
                                    )} :  ${JSON.stringify(attr.value.value)}`}
                                  </>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
