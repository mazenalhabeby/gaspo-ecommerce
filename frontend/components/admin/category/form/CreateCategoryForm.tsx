"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/lib/schemas/category.schema"
import {Button} from "@/components/ui/button"
import {useEffect} from "react"
import {ImageUploader} from "../../forms/ImageUploader"
import DetailsFormSection from "../../forms/DetailsFormSection"

interface CreateCategoryFormProps {
  initialData?: CategoryFormValues
  onSubmitHandler: (data: FormData) => Promise<void>
  mode?: "add" | "edit"
}

export default function CreateCategoryForm({
  initialData,
  onSubmitHandler,
  mode = "add",
}: CreateCategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {isValid, isDirty},
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onChange",
    defaultValues: initialData ?? {
      name: "",
      slug: "",
      description: "",
      image: undefined,
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

  const onSubmit = async (data: CategoryFormValues) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("slug", data.slug)
    if (data.description) formData.append("description", data.description)
    if (data.image) formData.append("image", data.image)
    await onSubmitHandler(formData)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl px-4 py-10 space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        <ImageUploader<CategoryFormValues>
          label="Category Image"
          name="image"
          multiple={false}
          required
          setValue={setValue}
          watch={watch}
        />
      </div>

      <div className="flex items-center justify-end pt-6 border-t">
        <Button type="submit" disabled={mode === "edit" ? !isDirty : !isValid}>
          {mode === "edit" ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}
