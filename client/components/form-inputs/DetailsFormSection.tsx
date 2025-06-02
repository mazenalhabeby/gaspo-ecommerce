import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Loader2} from "lucide-react"
import {toast} from "sonner"
import {
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"
import RequiredMark from "@/components/RequiredMark"
import {translateText} from "@/lib/utils/translate"

interface DescriptionUploaderProps<T extends FieldValues> {
  register: UseFormRegister<T>
  setValue: UseFormSetValue<T>
  fieldNames: {
    name: Path<T>
    description: Path<T>
  }
  label?: string
  customLabels?: {
    nameLabel?: string
    descriptionLabel?: string
  }
  sourceText?: {
    name: string
    description: string
  }
  sourceLang: string
  targetLang: string
  errors?: Record<string, {message?: string}>
}

export default function DetailsFormSection<T extends FieldValues>({
  register,
  setValue,
  fieldNames,
  label = "Item",
  customLabels,
  sourceText,
  sourceLang,
  targetLang,
  errors = {},
}: DescriptionUploaderProps<T>) {
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText?.name && !sourceText?.description) {
      toast.error("Nothing to translate from source language.")
      return
    }

    setLoading(true)
    try {
      const [translatedName, translatedDescription] = await Promise.all([
        translateText(sourceText.name, sourceLang, targetLang),
        translateText(sourceText.description, sourceLang, targetLang),
      ])

      setValue(
        fieldNames.name,
        translatedName as PathValue<T, typeof fieldNames.name>
      )
      setValue(
        fieldNames.description,
        translatedDescription as PathValue<T, typeof fieldNames.description>
      )

      toast.success(`Translated from ${sourceLang} to ${targetLang}`)
    } catch {
      toast.error("Translation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="info-card mx-auto">
      <h3 className="info-card-title">{label?.toUpperCase()} DETAILS</h3>

      <div className="mb-2 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="link"
          className="text-primary"
          disabled={loading}
          onClick={handleTranslate}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>🌐 Translate from {sourceLang.toUpperCase()}</>
          )}
        </Button>
      </div>

      <div>
        <Label htmlFor="name" className="info-card-label">
          {customLabels?.nameLabel || `${label} Name`}{" "}
          <RequiredMark style="star" />
        </Label>
        <Input {...register(fieldNames.name)} placeholder="Enter name" />
        {errors?.[fieldNames.name]?.message && (
          <span className="text-red-500 text-sm">
            {errors[fieldNames.name]?.message as string}
          </span>
        )}
      </div>

      <div className="mt-4">
        <Label htmlFor="description" className="info-card-label">
          {customLabels?.descriptionLabel || `${label} Description`}{" "}
          <RequiredMark style="star" />
        </Label>
        <Textarea
          {...register(fieldNames.description)}
          placeholder="Enter description..."
          className="min-h-[160px]"
        />
        {errors?.[fieldNames.description]?.message && (
          <span className="text-red-500 text-sm">
            {errors[fieldNames.description]?.message as string}
          </span>
        )}
      </div>
    </div>
  )
}
