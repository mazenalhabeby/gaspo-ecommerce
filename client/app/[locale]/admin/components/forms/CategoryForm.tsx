"use client"

import {Button} from "@/components/ui/button"
import DetailsFormSection from "@/components/form-inputs/DetailsFormSection"
import {ImageUploader} from "@/components/form-inputs/ImageUploader"
import {CategoryFormValues} from "@/lib/schema/categories.schema"
import {FieldValues, UseFormReturn} from "react-hook-form"
import {Language} from "@/i18n/routing"
import {useTranslations} from "next-intl"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {FaCheckCircle} from "react-icons/fa"
import {MdOutlineError} from "react-icons/md"

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues>
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
  form: UseFormReturn<CategoryFormValues>
  isDisabled?: boolean
  languages: Language[]
}

export default function CategoryForm({
  form,
  mode = "add",
  onSubmitHandler,
  isDisabled,
  languages,
}: CategoryFormProps) {
  const {register, setValue, watch, formState, handleSubmit} = form

  const t = useTranslations()

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData()

    const translations = languages.map((lang, index) => ({
      language: lang.code,
      name: data.translations?.[index]?.name || "",
      description: data.translations?.[index]?.description || "",
    }))

    formData.append("translations", JSON.stringify(translations))

    if (data.parentId) {
      formData.append("parentId", data.parentId)
    }

    if (data.image instanceof File) {
      formData.append("image", data.image)
    }
    await onSubmitHandler(formData)
  }

  const isLanguageValid = (code: string, index: number): boolean => {
    const values = watch(`translations.${index}`)
    return !!values?.name?.trim() && !!values?.description?.trim()
  }

  const allValid = languages.every((lang, index) =>
    isLanguageValid(lang.code, index)
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            ) // or hardcode 'en'
            const source = watch(`translations.${sourceLangIndex}`)

            return (
              <TabsContent key={lang.code} value={lang.code}>
                <DetailsFormSection
                  register={register}
                  setValue={setValue}
                  sourceLang={languages[sourceLangIndex].code}
                  targetLang={lang.code}
                  sourceText={{
                    name: source?.name || "",
                    description: source?.description || "",
                  }}
                  label={`${t("category.entity")} (${lang.label})`}
                  customLabels={{
                    nameLabel: `${t("category.name")} (${lang.label})`,
                    descriptionLabel: `${t("category.description")} (${
                      lang.label
                    })`,
                  }}
                  fieldNames={{
                    name: `translations.${index}.name`,
                    description: `translations.${index}.description`,
                  }}
                />
              </TabsContent>
            )
          })}
        </Tabs>
        <div>
          <ImageUploader
            label="Category Image"
            name="image"
            multiple={false}
            required
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={
            !!allValid || mode === "edit"
              ? !formState.isDirty
              : !formState.isValid || isDisabled
          }
        >
          {!isDisabled ? (
            mode === "edit" ? (
              "Update Category"
            ) : (
              "Create Category"
            )
          ) : (
            <span className="ml-2">Loading...</span>
          )}
        </Button>
      </div>
    </form>
  )
}
