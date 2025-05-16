"use client"

import {useRef} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {UploadCloud} from "lucide-react"
import {UseFormRegister, UseFormSetValue} from "react-hook-form"
import {toast} from "sonner"
import {ProductFormType} from "@/schemas/product.schema"
import RequiredMark from "@/components/RequiredMark"

interface ProductDetailsProps {
  register: UseFormRegister<ProductFormType>
  setValue: UseFormSetValue<ProductFormType>
}

export default function ProductDetails({
  register,
  setValue,
}: ProductDetailsProps) {
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

    if (!file.type.startsWith("text/")) {
      toast.error("Please upload a plain text file.")
      return
    }
    if (file.type !== "text/plain") {
      toast.error("Only .txt files are allowed.")
      return
    }

    try {
      const text = await file.text()
      setValue("description", text.trim())
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
    <div>
      <h3 className="product-info-card-title">description</h3>
      <div className="mx-auto product-info-card">
        <div>
          <Label htmlFor="productName" className="product-info-card-label">
            Product Name
            <RequiredMark style="star" />
          </Label>

          <Input
            id="productName"
            {...register("name")}
            placeholder="Enter product name"
          />
          <Input
            id="slug"
            placeholder="Slug e.g. argus-4-pro-kit"
            {...register("slug")}
            className=" border-0 shadow-none text-gray-400 text-xs placeholder:text-xs placeholder:text-gray-400 pointer-events-none"
            readOnly
          />
        </div>

        <div>
          <div className="flex flex-row items-center justify-between w-full">
            <Label htmlFor="description" className="product-info-card-label">
              Product Description
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
            placeholder="Enter product description..."
            className="min-h-[160px]"
            {...register("description")}
          />
        </div>
      </div>
    </div>
  )
}
