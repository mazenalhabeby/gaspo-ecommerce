"use client"

import React, {useRef} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {UploadCloud} from "lucide-react"
import {toast} from "sonner"
import {
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"
import RequiredMark from "@/components/RequiredMark"

interface DescriptionUploaderProps<T extends FieldValues> {
  register: UseFormRegister<T>
  setValue: UseFormSetValue<T>
  fieldNames: {
    name: Path<T>
    slug: Path<T>
    description: Path<T>
  }
  label?: string
  showSlug?: boolean
}

export default function DetailsFormSection<T extends FieldValues>({
  register,
  setValue,
  fieldNames,
  label = "Product",
  showSlug = true,
}: DescriptionUploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast.error("No file selected")
      return
    }

    if (file.size > 1024 * 100) {
      toast.error("File is too large. Max 100KB.")
      return
    }

    if (!file.type.startsWith("text/") || file.type !== "text/plain") {
      toast.error("Only .txt text files are allowed.")
      return
    }

    try {
      const text = await file.text()
      setValue(
        fieldNames.description,
        text.trim() as PathValue<T, typeof fieldNames.description>
      )
      toast.success("File content loaded into description.")
    } catch (err) {
      toast.error("Failed to read file", {
        description: (err as Error)?.message || "Unknown error",
      })
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <React.Fragment>
      <h3 className="info-card-title">{label.toLowerCase()} description</h3>
      <div className="info-card mx-auto">
        <div>
          <Label htmlFor="productName" className="info-card-label">
            {label} Name
            <RequiredMark style="star" />
          </Label>

          <Input
            id="productName"
            placeholder={`Enter ${label.toLowerCase()} name`}
            {...register(fieldNames.name)}
          />

          {showSlug && (
            <Input
              id="slug"
              placeholder="Slug e.g. argus-4-pro-kit"
              {...register(fieldNames.slug)}
              className="border-0 shadow-none text-gray-400 text-xs placeholder:text-xs placeholder:text-gray-400 pointer-events-none"
              readOnly
            />
          )}
        </div>

        <div>
          <div className="flex flex-row items-center justify-between w-full">
            <Label htmlFor="description" className="info-card-label">
              {label} Description
              <RequiredMark style="star" />
            </Label>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-primary flex items-center gap-1"
              onClick={handleClickUpload}
            >
              <UploadCloud className="w-4 h-4" />
              Upload .txt file
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".txt"
            className="hidden"
            onChange={handleFileUpload}
          />

          <Textarea
            id="description"
            placeholder={`Enter ${label.toLowerCase()} description...`}
            className="min-h-[160px]"
            {...register(fieldNames.description)}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
