"use client"

import {FieldValues, UseFormReturn} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {toast} from "sonner"
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
import {useMemo} from "react"
import {Product} from "@/lib/schema/products.schema"

interface ProductFormProps {
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
  isLoading?: boolean
  form: UseFormReturn<Product>
  languages: Language[]
}

export default function ProductForm({
  onSubmitHandler,
  mode = "add",
  form,
  languages = [],
}: ProductFormProps) {
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

  const translations = watch("translations")

  const enTranslation = useMemo(() => {
    return (
      translations?.find((t: {language: string}) => t.language === "en") ?? {
        name: "",
        description: "",
      }
    )
  }, [translations])

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData()

    const translations = languages.map((lang, index) => ({
      language: lang.code,
      name: data.translations?.[index]?.name || "",
      description: data.translations?.[index]?.description || "",
    }))

    console.log("Translations Data", translations)

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
    formData.append("translations", JSON.stringify(translations))
    appendArrayFieldToFormData(formData, "variantFields", data.variantFields)
    appendJsonFieldToFormData(formData, "packages", data.packages)
    appendJsonFieldToFormData(formData, "variants", data.variants)
    appendJsonFieldToFormData(formData, "metadata", data.metadata)
    appendJsonFieldToFormData(formData, "bundleMetadata", data.bundleMetadata)
    if (Array.isArray(data.images)) {
      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img)
        }
      })
    }

    try {
      await onSubmitHandler(formData)
      toast.success("Product successfully submitted!")
    } catch (error) {
      toast.error((error as Error).message || "Failed to submit product")
    }
  }

  const isLanguageValid = (code: string, index: number): boolean => {
    const values = watch(`translations.${index}`)
    return !!values?.name?.trim() && !!values?.description?.trim()
  }

  // const allValid = languages.every((lang, index) =>
  //   isLanguageValid(lang.code, index)
  // )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl mx-auto px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <input
            type="text"
            {...register("name")}
            defaultValue={enTranslation.name}
            disabled
          />
          <input
            type="text"
            {...register("description")}
            defaultValue={enTranslation.description}
            disabled
          />
          <input
            type="text"
            {...register("slug")}
            defaultValue={slugify(enTranslation.name)}
            disabled
          />
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
              const source = watch(`translations.${sourceLangIndex}`)

              return (
                <TabsContent key={lang.code} value={lang.code}>
                  <DetailsFormSection
                    register={register}
                    setValue={setValue}
                    fieldNames={{
                      name: `translations.${index}.name`,
                      description: `translations.${index}.description`,
                    }}
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
                    errors={
                      formState.errors.translations?.[index]
                        ? Object.fromEntries(
                            Object.entries(
                              formState.errors.translations[index] as Record<
                                string,
                                unknown
                              >
                            ).map(([key, value]) => [
                              key,
                              {message: (value as {message?: string})?.message},
                            ])
                          )
                        : {}
                    }
                  />
                </TabsContent>
              )
            })}
          </Tabs>

          <CategorySelector
            categories={categories}
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
          <ImageUploader
            label="Product Images"
            name="images"
            required
            multiple
            setValue={setValue}
            watch={watch}
          />
          <Pricing watch={watch} setValue={setValue} />
          <InventoryInputs register={register} />
          <VariantManager
            setValue={setValue}
            getValues={getValues}
            currency={watch("currency")}
            control={control}
          />
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

      {formState.isSubmitting && (
        <div className="text-center text-blue-500">
          Submitting your product...
        </div>
      )}

      {formState.isSubmitSuccessful && (
        <div className="text-center text-green-500">
          Product submitted successfully!
        </div>
      )}

      {formState.isDirty &&
        Object.entries(formState.dirtyFields).map(([field, value]) => (
          <span key={field} className="text-blue-500 block">
            {field} has been modified. {value ? "Yes" : "No"}
          </span>
        ))}

      {formState.isValid && (
        <div className="text-center text-green-500">All fields are valid!</div>
      )}

      <div className="flex items-center gap-3 justify-end pt-8 border-t">
        <Button type="submit">
          {mode === "edit" ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
