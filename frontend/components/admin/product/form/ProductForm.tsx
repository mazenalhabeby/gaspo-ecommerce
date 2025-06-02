"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
  ProductResponse,
  productResponseSchema,
} from "@/lib/schemas/product.schema"
import {Button} from "@/components/ui/button"

import CategorySelector from "../../forms/products/CategorySelector"
import Pricing from "../../forms/products/Pricing"
import ShippingAndDelivery from "../../forms/products/ShippingAndDelivery"
import VariantManager from "../../forms/products/VariantManager"
import {toast} from "sonner"
import InventoryInputs from "../../forms/products/InventoryInputs"
import {useEffect} from "react"
import {useCategories} from "@/hooks/categories/useCategories"
import {ImageUploader} from "../../forms/ImageUploader"
import DetailsFormSection from "../../forms/DetailsFormSection"
import {
  appendArrayFieldToFormData,
  appendJsonFieldToFormData,
} from "@/lib/formData"

interface ProductFormProps {
  initialData?: ProductResponse
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
  isLoading?: boolean
}

export default function ProductForm({
  initialData,
  onSubmitHandler,
  mode = "add",
  isLoading,
}: ProductFormProps) {
  const {data: categories = []} = useCategories()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    reset,
    formState: {isValid, isDirty},
  } = useForm<ProductResponse>({
    resolver: zodResolver(productResponseSchema),
    mode: "onChange",
    defaultValues: initialData ?? {
      name: "",
      slug: "",
      description: "",
      categoryId: "<category-id>",
      currency: "$",
      price: 0,
      sku: "",
      stock: 0,
      weight: 0,
      weightUnit: "KG",
      packages: [],
      images: [],
      variants: [],
      variantFields: [],
    },
  })

  const name = watch("name")

  useEffect(() => {
    const slug = name
      ?.normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")

    setValue("slug", slug || "")
  }, [name, setValue])

  const onSubmit = async (data: ProductResponse) => {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("slug", data.slug)
    formData.append("description", data.description)
    formData.append("categoryId", data.categoryId ?? "")

    console.log(data.categoryId)
    formData.append("currency", data.currency)
    formData.append("sku", data.sku ?? "")
    formData.append("price", String(data.price))
    formData.append("stock", String(data.stock))
    formData.append("weight", String(data.weight))
    formData.append("weightUnit", data.weightUnit)

    appendArrayFieldToFormData(formData, "variantFields", data.variantFields)
    appendJsonFieldToFormData(formData, "packages", data.packages)
    appendJsonFieldToFormData(formData, "variants", data.variants)

    data.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img)
      }
    })

    try {
      await onSubmitHandler(formData)
      toast.success("Product created!")
      reset(data)
    } catch (error) {
      toast.error((error as Error).message || "Failed to create product.")
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl mx-auto px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <DetailsFormSection
            register={register}
            setValue={setValue}
            fieldNames={{
              description: "description",
              name: "name",
              slug: "slug",
            }}
          />
          <CategorySelector
            categories={categories.map((c) => ({id: c.id, name: c.name}))}
            watch={watch}
            setValue={setValue}
          />
          <ShippingAndDelivery
            register={register}
            watch={watch}
            setValue={setValue}
            control={control}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ImageUploader<ProductResponse>
            label="Product Images"
            name="images"
            primaryName="images"
            required
            multiple
            setValue={setValue}
            watch={watch}
          />
          <Pricing watch={watch} setValue={setValue} />
          <InventoryInputs register={register} />
          <VariantManager
            control={control}
            setValue={setValue}
            getValues={getValues}
            currency={watch("currency")}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pt-8 border-t">
        <Button
          type="submit"
          disabled={
            mode === "edit" ? !isDirty || !isValid : !isValid || isLoading
          }
        >
          {mode === "edit" ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
