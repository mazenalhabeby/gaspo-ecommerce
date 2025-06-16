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
  FieldArrayWithId,
  UseFormRegister,
} from "react-hook-form"
import VariantFieldDialog from "./VariantFieldDialog"
import {ProductFormValues} from "@/lib/schema/products.schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {currencyOptions} from "../../../data/currancy-avalible"
import RequiredMark from "@/components/RequiredMark"

interface VariantManagerProps {
  currency: string
  control: Control<ProductFormValues>
  setValue: UseFormSetValue<ProductFormValues>
  getValues: UseFormGetValues<ProductFormValues>
  register: UseFormRegister<ProductFormValues>
}

type VariantAttribute = {
  id: string
  name: string
  value: string
}

type VariantField = FieldArrayWithId<ProductFormValues, "variants", "id"> & {
  attributes?: VariantAttribute[]
}

export default function VariantManager({
  currency,
  control,
  setValue,
  getValues,
  register,
}: VariantManagerProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: "variants",
  })

  const variantFields = getValues("variantFields") || []

  const addVariant = () => {
    const defaultAttrs = variantFields.map((name: string) => ({
      id: crypto.randomUUID(),
      name,
      value: "",
    }))

    append({
      name: "",
      slug: "",
      sku: "",
      price: 0,
      stock: 0,
      attributes: defaultAttrs,
    })
  }

  return (
    <div>
      <h3 className="font-semibold text-lg">Variants</h3>
      <div className="info-card">
        {/* Add New Field Dialog */}
        <div className="flex justify-end items-center">
          <VariantFieldDialog
            onAdd={(newField) => {
              const updatedFields = [...variantFields, newField]
              setValue("variantFields", updatedFields)

              const existingVariants = getValues("variants") || []
              const updatedVariants = existingVariants.map((variant) => {
                const attrs: VariantAttribute[] = (variant.attributes || [])
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((attr: any) => ({
                    id: attr.id ? attr.id : crypto.randomUUID(),
                    name: attr.name,
                    value: attr.value,
                  }))

                if (
                  !attrs.find(
                    (attr: VariantAttribute) => attr.name === newField
                  )
                ) {
                  attrs.push({
                    id: crypto.randomUUID(),
                    name: newField,
                    value: "",
                  })
                }

                return {
                  ...variant,
                  attributes: attrs,
                }
              })

              setValue("variants", updatedVariants)
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sku" className="info-card-label">
            SKU
            <RequiredMark style="star" />
          </Label>
          <Input id="sku" placeholder="Enter SKU" {...register("sku")} />
        </div>
        {/* Render Each Variant Row */}
        {fields.map((field, index) => {
          const typedField = field as VariantField
          return (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-variant gap-4 border p-3 rounded-md relative bg-muted/40"
            >
              <div className="space-y-1">
                <Label>Variant Name</Label>
                <Controller
                  control={control}
                  name={`variants.${index}.name`}
                  render={({field}) => (
                    <Input placeholder="Variant Name" {...field} />
                  )}
                />
              </div>

              {/* Attribute Inputs */}
              {typedField.attributes?.map((attr, attrIndex) => (
                <div key={attrIndex} className="space-y-1">
                  <Label>{attr.name}</Label>
                  <Controller
                    control={control}
                    name={`variants.${index}.attributes.${attrIndex}.value`}
                    render={({field}) => (
                      <Input placeholder={`Enter ${attr.name}`} {...field} />
                    )}
                  />
                </div>
              ))}

              <div className="space-y-1">
                <Label>SKU</Label>
                <Controller
                  control={control}
                  name={`variants.${index}.sku`}
                  render={({field}) => (
                    <Input
                      placeholder="SKU"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>

              <div className="space-y-1">
                <Label>Price</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={currency}
                    onValueChange={(val) => setValue("currency", val)}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue defaultValue={currency} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {/* Remove Button */}
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
          )
        })}

        {/* Add Variant Row Button */}
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
