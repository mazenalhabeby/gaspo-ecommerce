"use client"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Trash2} from "lucide-react"
import {
  useFieldArray,
  Controller,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form"
import {ProductFormType} from "@/schemas/product.schema"

interface VariantManagerProps {
  currency: string
  control: Control<ProductFormType>
  setValue: UseFormSetValue<ProductFormType>
  getValues: UseFormGetValues<ProductFormType>
}

export default function VariantManager({
  currency,
  control,
  setValue,
  getValues,
}: VariantManagerProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: "variants",
  })

  const variantFields = getValues("variantFields")

  const addVariantField = () => {
    const newField = prompt("Enter new variant attribute (e.g. Color, Size):")
    if (!newField) return
    const updatedFields = [...variantFields, newField]
    setValue("variantFields", updatedFields)

    const variants = getValues("variants")
    const updatedVariants = variants.map((v) => ({
      ...v,
      attributes: {
        ...v.attributes,
        [newField]: "",
      },
    }))
    setValue("variants", updatedVariants)
  }

  const addVariant = () => {
    const defaultAttrs = Object.fromEntries(variantFields.map((f) => [f, ""]))
    append({
      id: crypto.randomUUID(),
      vName: "",
      sku: "",
      price: "",
      stock: "",
      attributes: defaultAttrs,
    })
  }

  return (
    <div>
      <h3 className="font-semibold text-lg">Variants</h3>
      <div className="product-info-card">
        <div className="flex justify-end items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/90"
            onClick={addVariantField}
          >
            + Add Variant Attribute
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-variant gap-4 border p-3 rounded-md relative bg-muted/40"
          >
            <div className="space-y-1">
              <Label>Variant Name</Label>
              <Controller
                control={control}
                name={`variants.${index}.vName`}
                render={({field}) => (
                  <Input placeholder="Variant Name" {...field} />
                )}
              />
            </div>

            {variantFields.map((vf) => (
              <div key={vf} className="space-y-1">
                <Label>{vf}</Label>
                <Controller
                  control={control}
                  name={`variants.${index}.attributes.${vf}`}
                  render={({field}) => (
                    <Input placeholder={`Enter ${vf}`} {...field} />
                  )}
                />
              </div>
            ))}

            <div className="space-y-1">
              <Label>SKU</Label>
              <Controller
                control={control}
                name={`variants.${index}.sku`}
                render={({field}) => <Input placeholder="SKU" {...field} />}
              />
            </div>

            <div className="space-y-1">
              <Label>Price</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-muted px-2 rounded border">
                  {currency}
                </span>
                <Controller
                  control={control}
                  name={`variants.${index}.price`}
                  render={({field}) => (
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Stock</Label>
              <Controller
                control={control}
                name={`variants.${index}.stock`}
                render={({field}) => (
                  <Input type="number" placeholder="0" {...field} />
                )}
              />
            </div>

            <div className="absolute top-3 right-3">
              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50 bg-white rounded-full border border-primary/20 shadow-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          type="button"
          size="sm"
          className="text-primary hover:text-primary/90"
          onClick={addVariant}
        >
          + Add Variant Row
        </Button>
      </div>
    </div>
  )
}
