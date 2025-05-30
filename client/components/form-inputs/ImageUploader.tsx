/* eslint-disable @next/next/no-img-element */
"use client"

import React, {useCallback, useEffect, useMemo} from "react"
import {useDropzone} from "react-dropzone"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import RequiredMark from "@/components/RequiredMark"
import {ImagePlus} from "lucide-react"
import {UseFormSetValue, UseFormWatch, FieldValues, Path} from "react-hook-form"

type PreviewUrl = {
  file: File | string
  url: string
}

interface Props<T extends FieldValues> {
  label: string
  name: Path<T>
  primaryName?: Path<T>
  multiple?: boolean
  required?: boolean
  setValue: UseFormSetValue<T>
  watch: UseFormWatch<T>
}

export function ImageUploader<T extends FieldValues>({
  label,
  name,
  primaryName,
  multiple = false,
  required = false,
  setValue,
  watch,
}: Props<T>) {
  const images = watch(name)
  const primaryImage = primaryName ? watch(primaryName) : null

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return

      if (multiple) {
        const updated = [...(images || []), ...acceptedFiles]
        setValue(name, updated as T[typeof name], {shouldDirty: true})
        if (primaryName && !primaryImage) {
          setValue(primaryName, acceptedFiles[0] as T[typeof primaryName], {
            shouldDirty: true,
          })
        }
      } else {
        setValue(name, acceptedFiles[0] as T[typeof name], {shouldDirty: true})
      }
    },
    [images, multiple, primaryImage, setValue, name, primaryName]
  )

  const handleReplace = (index: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return

      if (multiple && Array.isArray(images)) {
        const updated = [...images]
        updated[index] = file
        setValue(name, updated as T[typeof name], {shouldDirty: true})
        if (primaryName && images[index] === primaryImage) {
          setValue(primaryName, file as T[typeof primaryName], {
            shouldDirty: true,
          })
        }
      } else {
        setValue(name, file as T[typeof name], {shouldDirty: true})
      }
    }
    input.click()
  }

  const handleRemove = (index: number) => {
    if (!multiple) {
      setValue(name, undefined as T[typeof name], {shouldDirty: true})
      return
    }

    const removed = images[index]
    const updated = images.filter((_: unknown, i: number) => i !== index)
    setValue(name, updated as T[typeof name], {shouldDirty: true})
    if (primaryName && removed === primaryImage) {
      setValue(primaryName, updated[0] || null, {shouldDirty: true})
    }
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple,
  })

  const previewUrls: PreviewUrl[] = useMemo(() => {
    if (!images) return []
    const list = multiple ? images : [images]

    return list.filter(Boolean).map((img: File | string | {url: string}) => {
      if (typeof img === "string") return {file: img, url: img}
      if (img instanceof File) return {file: img, url: URL.createObjectURL(img)}
      if (typeof img === "object" && img !== null && "url" in img)
        return {file: img.url, url: img.url}
      return {file: "", url: ""}
    })
  }, [images, multiple])

  useEffect(() => {
    return () => {
      previewUrls.forEach((img) => {
        if (img.file instanceof File) URL.revokeObjectURL(img.url)
      })
    }
  }, [previewUrls])

  return (
    <React.Fragment>
      <h3 className="info-card-title">{label.toLowerCase()}</h3>
      <div className="info-card">
        <Label className="info-card-label">
          {label}
          {required && <RequiredMark style="star" />}
          <span className="text-sm text-muted-foreground">
            {multiple ? "(multiple images allowed)" : "(only 1 image)"}
          </span>
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(multiple || !previewUrls.length) && (
            <div
              {...getRootProps()}
              className={cn(
                "aspect-square border-2 border-dashed rounded-md flex items-center justify-center text-center text-sm cursor-pointer hover:bg-muted transition min-w-32",
                isDragActive && "border-primary bg-muted"
              )}
            >
              <input {...getInputProps()} />
              <div className="text-muted-foreground flex flex-col items-center gap-2 p-2">
                <ImagePlus className="w-8 h-8" />
                <div>
                  <span>
                    <span className="text-primary underline underline-offset-4 font-semibold">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </span>
                </div>
              </div>
            </div>
          )}

          {previewUrls.map((img, i) => {
            const fileA = primaryImage as File | string | null
            const fileB = img.file as File | string

            const isPrimary =
              primaryName &&
              ((fileA instanceof File &&
                fileB instanceof File &&
                fileA.name === fileB.name) ||
                (typeof fileA === "string" &&
                  typeof fileB === "string" &&
                  fileA === fileB))

            return (
              <div
                key={i}
                className="relative group aspect-square rounded-md overflow-hidden border"
              >
                <img
                  src={img.url}
                  alt={`Preview ${i}`}
                  className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-1 text-white">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => handleReplace(i)}
                  >
                    Replace
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => handleRemove(i)}
                  >
                    Remove
                  </Button>
                </div>

                {primaryName && (
                  <span
                    className={`${
                      isPrimary ? "bg-blue-500" : "bg-black/50"
                    } absolute top-1 left-1 text-xs px-2 py-0.5 rounded shadow text-white cursor-pointer backdrop-blur-2xl`}
                    onClick={() =>
                      setValue(primaryName, img.file as T[typeof primaryName], {
                        shouldDirty: true,
                      })
                    }
                  >
                    {isPrimary ? "Primary" : "Set as Primary"}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </React.Fragment>
  )
}
