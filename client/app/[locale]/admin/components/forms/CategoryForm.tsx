"use client"

import {Button} from "@/components/ui/button"
import DetailsFormSection from "@/components/form-inputs/DetailsFormSection"
import {ImageUploader} from "@/components/form-inputs/ImageUploader"
import {CategoryFormValues} from "@/lib/schema/categories.schema"
import {FieldValues, UseFormReturn} from "react-hook-form"
import {useEffect} from "react"

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues>
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
  form: UseFormReturn<CategoryFormValues>
  isDisabled?: boolean
}

export default function CategoryForm({
  form,
  mode = "add",
  onSubmitHandler,
  isDisabled,
}: CategoryFormProps) {
  const {register, setValue, watch, formState, handleSubmit} = form

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

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("slug", data.slug)
    if (data.description) formData.append("description", data.description)

    // Only send image if it's a File (new upload)
    if (data.image instanceof File) {
      formData.append("image", data.image)
    }

    await onSubmitHandler(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <DetailsFormSection
            register={register}
            setValue={setValue}
            label="Category"
            fieldNames={{
              description: "description",
              name: "name",
              slug: "slug",
            }}
          />
        </div>
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
            mode === "edit"
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
