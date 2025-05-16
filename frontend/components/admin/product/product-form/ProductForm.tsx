"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {productSchema, ProductFormType} from "@/schemas/product.schema"
import {Button} from "@/components/ui/button"
import {ImageUploader} from "./ImageUploader"
import CategorySelector from "./CategorySelector"
import Pricing from "./Pricing"
import ShippingAndDelivery from "./ShippingAndDelivery"
import VariantManager from "./VariantManager"
import {toast} from "sonner"
import InventoryInputs from "./InventoryInputs"
import {useEffect} from "react"
import ProductDetails from "./ProductDetails"

interface ProductFormProps {
  initialData?: ProductFormType
  onSubmitHandler: (data: ProductFormType) => void
  mode?: "add" | "edit"
}

export default function ProductForm({
  initialData,
  onSubmitHandler,
  mode,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState,
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: initialData ?? {
      name: "",
      slug: "",
      description: "",
      category: "",
      currency: "$",
      price: "",
      sku: "",
      quantity: "",
      weight: "",
      weightUnit: "kg",
      packages: [{length: "", breadth: "", width: "", unit: "in"}],
      images: [],
      primaryImage: null,
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

  const onError = (errors: typeof formState.errors) => {
    const firstFieldWithError = Object.entries(errors).find(
      ([, value]) => value?.message
    )
    if (firstFieldWithError) {
      const [field, errorObj] = firstFieldWithError
      // errorObj is of type FieldError | undefined
      toast.error(
        (errorObj && typeof errorObj === "object" && "message" in errorObj
          ? (errorObj as {message?: string}).message
          : undefined) ?? `Invalid field: ${field}`
      )
    } else {
      toast.error("Please fix the validation errors before submitting.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler, onError)}
      className="max-w-screen-xl mx-auto px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <ProductDetails register={register} setValue={setValue} />
          <CategorySelector
            categories={["Electronics", "Toys", "Beauty", "Home"]}
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
          <ImageUploader setValue={setValue} watch={watch} />
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
        <Button type="submit" disabled={!formState.isValid}>
          {mode === "edit" ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
