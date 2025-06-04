/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {FieldValues, UseFormReturn} from "react-hook-form"
import {Button} from "@/components/ui/button"

import {
  appendArrayFieldToFormData,
  appendJsonFieldToFormData,
  slugify,
} from "@/lib/utils"
import DetailsFormSection from "@/components/form-inputs/DetailsFormSection"
import CategorySelector from "./inputs/CategorySelector"
import ShippingAndDelivery from "./inputs/ShippingAndDelivery"
import {ImageUploader} from "@/components/form-inputs/ImageUploader"
import Pricing from "./inputs/Pricing"
import InventoryInputs from "./inputs/InventoryInputs"
import VariantManager from "./inputs/VariantManager"
import {useCategories} from "@/hooks/use-categories"
import {Language} from "@/i18n/routing"
import {useTranslations} from "next-intl"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {FaCheckCircle} from "react-icons/fa"
import {MdOutlineError} from "react-icons/md"
import {useMemo, useState} from "react"
import {ProductFormValues} from "@/lib/schema/products.schema"

interface ProductFormProps {
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
  isLoading?: boolean
  form: UseFormReturn<ProductFormValues>
  languages: Language[]
  isDisabled?: boolean
}

export default function ProductForm({
  onSubmitHandler,
  mode = "add",
  form,
  languages = [],
  isDisabled,
}: ProductFormProps) {
  const [useVariants, setUseVariants] = useState(false)
  const {data: categories = []} = useCategories()
  const t = useTranslations()

  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState,
    control,
  } = form

  const ProductTranslations = watch("ProductTranslations")

  const enTranslation = useMemo(() => {
    return (
      ProductTranslations?.find(
        (t: {language: string}) => t.language === "en"
      ) ?? {
        name: "",
        description: "",
      }
    )
  }, [ProductTranslations])

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData()

    const translations = languages.map((lang, index) => ({
      language: lang.code,
      name: data.ProductTranslations?.[index]?.name || "",
      description: data.ProductTranslations?.[index]?.description || "",
    }))
    const cleanedVariants = (data.variants || []).map((variant: any) => ({
      ...variant,
      attributes: (variant.attributes || []).map((attr: any) => ({
        ...attr,
        value:
          typeof attr.value === "object"
            ? String(attr.value?.value ?? "")
            : String(attr.value ?? ""),
      })),
    }))
    formData.append("name", enTranslation.name)
    formData.append("description", enTranslation.description)
    formData.append("slug", slugify(enTranslation.name))
    formData.append("categoryId", data.categoryId)
    formData.append("currency", data.currency)
    formData.append("sku", data.sku)
    formData.append("price", String(data.price))
    formData.append("seoTitle", data.seoTitle || "")
    formData.append("seoDesc", data.seoDesc || "")
    formData.append("stock", String(data.stock))
    formData.append("weight", String(data.weight))
    formData.append("weightUnit", data.weightUnit)
    if (data.status) formData.append("status", data.status)
    formData.append("ProductTranslations", JSON.stringify(translations))
    appendArrayFieldToFormData(formData, "variantFields", data.variantFields)
    appendJsonFieldToFormData(formData, "packages", data.packages)
    appendJsonFieldToFormData(formData, "variants", cleanedVariants)
    appendJsonFieldToFormData(formData, "metadata", data.metadata)
    appendJsonFieldToFormData(formData, "bundleMetadata", data.bundleMetadata)
    if (Array.isArray(data.images)) {
      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img)
        }
      })
    }

    await onSubmitHandler(formData)
  }

  const isLanguageValid = (code: string, index: number): boolean => {
    const values = watch(`ProductTranslations.${index}`)
    return !!values?.name?.trim() && !!values?.description?.trim()
  }

  const allValid = languages.every((lang, index) =>
    isLanguageValid(lang.code, index)
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl mx-auto px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Tabs defaultValue={languages[0].code} className="w-full">
            <TabsList>
              {languages.map((lang, index) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                  {isLanguageValid(lang.code, index) ? (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  ) : (
                    <MdOutlineError className="text-red-500 text-sm" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang, index) => {
              const sourceLangIndex = languages.findIndex(
                (l) => l.code !== lang.code
              )
              const source = watch(`ProductTranslations.${sourceLangIndex}`)

              return (
                <TabsContent key={lang.code} value={lang.code}>
                  <DetailsFormSection
                    register={register}
                    setValue={setValue}
                    label={`${t("product.entity")} (${lang.label})`}
                    customLabels={{
                      nameLabel: `${t("product.name")} (${lang.label})`,
                      descriptionLabel: `${t("product.description")} (${
                        lang.label
                      })`,
                    }}
                    sourceLang={languages[sourceLangIndex].code}
                    targetLang={lang.code}
                    sourceText={{
                      name: source?.name || "",
                      description: source?.description || "",
                    }}
                    fieldNames={{
                      name: `ProductTranslations.${index}.name`,
                      description: `ProductTranslations.${index}.description`,
                    }}
                  />
                </TabsContent>
              )
            })}
          </Tabs>

          <ShippingAndDelivery
            register={register}
            watch={watch}
            setValue={setValue}
            control={control}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ImageUploader
            label="Product Images"
            name="images"
            required
            multiple
            setValue={setValue}
            watch={watch}
          />

          <div className="space-y-6">
            <CategorySelector categories={categories} control={control} />
            {/* Toggle Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Product Type</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUseVariants((prev) => !prev)}
              >
                {useVariants ? "Switch to Simple Product" : "Use Variants"}
              </Button>
            </div>

            {/* Conditional UI */}
            {!useVariants ? (
              <>
                <Pricing watch={watch} setValue={setValue} />
                <InventoryInputs register={register} />
              </>
            ) : (
              <VariantManager
                setValue={setValue}
                getValues={getValues}
                currency={watch("currency")}
                control={control}
                register={register}
              />
            )}
          </div>
        </div>
      </div>
      {formState.errors &&
        Object.entries(formState.errors).map(([field, error]) =>
          error && "message" in error ? (
            <span key={field} className="text-red-500 block">
              {field}: {(error as {message?: string}).message}
            </span>
          ) : null
        )}

      <div className="flex items-center gap-3 justify-end pt-8 border-t">
        <Button
          type="submit"
          className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          disabled={
            !!allValid || mode === "edit"
              ? !formState.isDirty
              : !formState.isValid || isDisabled
          }
        >
          {!isDisabled
            ? mode === "edit"
              ? "Update Product"
              : "Add Product"
            : "Loading..."}
        </Button>
      </div>
    </form>
  )
}
