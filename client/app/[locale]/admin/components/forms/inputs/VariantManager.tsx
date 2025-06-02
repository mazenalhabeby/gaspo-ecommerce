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
import VariantFieldDialog from "./VariantFieldDialog"
import {ProductCreate} from "@/lib/schema/products.schema"

interface VariantManagerProps {
  currency: string
  control: Control<ProductCreate>
  setValue: UseFormSetValue<ProductCreate>
  getValues: UseFormGetValues<ProductCreate>
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

  const addVariant = () => {
    const defaultAttrs: {id: string; name: string; value: string}[] =
      variantFields.map((f: string) => ({
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2),
        name: f,
        value: "",
      }))
    append({
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2),
      name: "",
      slug: "",
      sku: "",
      price: "0",
      stock: "0",
      attributes: defaultAttrs,
    })
  }

  return (
    <div>
      <h3 className="font-semibold text-lg">Variants</h3>
      <div className="info-card">
        <div className="flex justify-end items-center">
          <VariantFieldDialog
            onAdd={(newField) => {
              const updatedFields = [...variantFields, newField]
              setValue("variantFields", updatedFields)

              const variantsRaw: NonNullable<ProductCreate["variants"]> =
                getValues("variants") || []
              const updatedVariants = variantsRaw.map((v) => {
                const attrArray: {id: string; name: string; value: string}[] =
                  v.attributes ?? []
                const attrMap: Record<
                  string,
                  {id: string; name: string; value: string}
                > = {}
                attrArray.forEach((attr) => {
                  attrMap[attr.name] = attr
                })
                if (!attrMap[newField]) {
                  attrMap[newField] = {
                    id: crypto.randomUUID
                      ? crypto.randomUUID()
                      : Math.random().toString(36).substring(2),
                    name: newField,
                    value: "",
                  }
                }
                const newAttrArray = Object.values(attrMap)
                return {
                  ...v,
                  id:
                    v.id ??
                    (crypto.randomUUID
                      ? crypto.randomUUID()
                      : Math.random().toString(36).substring(2)),
                  slug: v.slug ?? "",
                  sku: v.sku ?? "",
                  price: v.price ?? 0,
                  stock: v.stock ?? 0,
                  attributes: newAttrArray,
                }
              })
              setValue("variants", updatedVariants)
            }}
          />
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-variant gap-4 border p-3 rounded-md relative bg-muted/40"
          >
            {/* Variant Name */}
            <div className="space-y-1">
              <Label>Variant Name</Label>
              <Controller
                control={control}
                name={`variants.${index}.name`}
                rules={{required: "Variant name is required"}}
                render={({field, fieldState}) => (
                  <>
                    <Input placeholder="Variant Name" {...field} />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Dynamic Attributes */}
            {fields[index]?.attributes?.map(
              (
                attr: {id: string; name: string; value: string},
                attrIndex: number
              ) => (
                <div key={attr.id} className="space-y-1">
                  <Label>{attr.name}</Label>
                  <Controller
                    control={control}
                    name={
                      `variants.${index}.attributes.${attrIndex}.value` as const
                    }
                    render={({field}) => (
                      <Input placeholder={`Enter ${attr.name}`} {...field} />
                    )}
                  />
                </div>
              )
            )}

            {/* SKU */}
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

            {/* Price */}
            <div className="space-y-1">
              <Label>Price</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-muted px-2 rounded border">
                  {currency}
                </span>
                <Controller
                  control={control}
                  name={`variants.${index}.price`}
                  rules={{
                    required: "Price is required",
                    min: {value: 0.01, message: "Price must be greater than 0"},
                  }}
                  render={({field, fieldState}) => (
                    <div className="w-full">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                      {fieldState.error && (
                        <span className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <Label>Stock</Label>
              <Controller
                control={control}
                name={`variants.${index}.stock`}
                rules={{
                  required: "Stock is required",
                  min: {value: 0, message: "Stock cannot be negative"},
                }}
                render={({field, fieldState}) => (
                  <>
                    <Input type="number" placeholder="0" {...field} />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Delete Button */}
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
