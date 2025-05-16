/* eslint-disable @next/next/no-img-element */
"use client"

import {useCallback, useEffect, useMemo} from "react"
import {useDropzone} from "react-dropzone"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {UseFormSetValue, UseFormWatch} from "react-hook-form"
import {ProductFormType} from "@/schemas/product.schema"
import RequiredMark from "@/components/RequiredMark"
import {Label} from "@/components/ui/label"
import {ImagePlus} from "lucide-react"

interface Props {
  setValue: UseFormSetValue<ProductFormType>
  watch: UseFormWatch<ProductFormType>
}

type PreviewUrl = {
  file: File | string
  url: string
}

export function ImageUploader({setValue, watch}: Props) {
  const images = watch("images")
  const primaryImage = watch("primaryImage")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...images, ...acceptedFiles]
      setValue("images", newImages)
      if (!primaryImage && acceptedFiles.length > 0) {
        setValue("primaryImage", acceptedFiles[0])
      }
    },
    [images, primaryImage, setValue]
  )

  const handleReplace = (index: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const newImages = [...images]
        newImages[index] = file
        setValue("images", newImages)
        if (primaryImage === images[index]) {
          setValue("primaryImage", file)
        }
      }
    }
    input.click()
  }

  const handleRemove = (index: number) => {
    const toRemove = images[index]
    const updated: File[] = images.filter((_: File, i: number) => i !== index)
    setValue("images", updated)
    if (primaryImage === toRemove) {
      setValue("primaryImage", updated[0] || null)
    }
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const previewUrls: PreviewUrl[] = useMemo(() => {
    return images.map((img) => {
      if (typeof img === "string") {
        return {file: img, url: img}
      } else if (img instanceof File) {
        return {file: img, url: URL.createObjectURL(img)}
      } else if (
        img &&
        typeof img === "object" &&
        "url" in img &&
        typeof img.url === "string"
      ) {
        return {file: img, url: img.url}
      } else {
        console.warn("Unknown image format:", img)
        return {file: img, url: ""}
      }
    })
  }, [images])

  useEffect(() => {
    return () => {
      previewUrls.forEach((img) => {
        if (img.file instanceof File) {
          URL.revokeObjectURL(img.url)
        }
      })
    }
  }, [previewUrls])

  return (
    <div>
      <h3 className="product-info-card-title">product images</h3>
      <div className="product-info-card">
        <Label className="product-info-card-label">
          Product Images
          <RequiredMark style="star" />
          <span className=" text-xs">at least 3 images</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            {...getRootProps()}
            className={cn(
              "aspect-square border-2 border-dashed rounded-md flex items-center justify-center text-center text-sm cursor-pointer hover:bg-muted transition",
              isDragActive && "border-primary bg-muted"
            )}
          >
            <input {...getInputProps()} />
            <div className="text-muted-foreground flex flex-col items-center gap-2 p-2">
              <ImagePlus className="w-8 h-8" />
              <div>
                <span>
                  <span className=" text-primary underline underline-offset-4 font-semibold">
                    Click to upload
                  </span>{" "}
                  <span>or</span>
                </span>{" "}
                <br />
                <span>drag and drop</span>
              </div>
            </div>
          </div>

          {previewUrls.map((img, i) => {
            const isPrimary =
              (primaryImage instanceof File &&
                img.file instanceof File &&
                primaryImage.name === img.file.name) ||
              (typeof primaryImage === "string" &&
                typeof img.file === "string" &&
                primaryImage === img.file)
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
                    onClick={() => handleReplace(i)}
                  >
                    Replace
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(i)}
                  >
                    Remove
                  </Button>
                </div>

                <span
                  className={`${
                    isPrimary ? "bg-blue-500" : "bg-black/50"
                  } absolute top-1 left-1 text-xs px-2 py-0.5 rounded shadow text-white cursor-pointer backdrop-blur-2xl`}
                  onClick={() => setValue("primaryImage", img.file)}
                >
                  {isPrimary ? "Primary" : "Set as Primary"}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
