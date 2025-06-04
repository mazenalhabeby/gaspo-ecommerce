"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Trash2} from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  Control,
  useFieldArray,
} from "react-hook-form"
import {ProductFormValues} from "@/lib/schema/products.schema"

interface ShippingAndDeliveryProps {
  register: UseFormRegister<ProductFormValues>
  setValue: UseFormSetValue<ProductFormValues>
  watch: UseFormWatch<ProductFormValues>
  control: Control<ProductFormValues>
}

export default function ShippingAndDelivery({
  setValue,
  watch,
  register,
  control,
}: ShippingAndDeliveryProps) {
  const weight = watch("weight") ?? 0
  const weightUnit = watch("weightUnit")

  const {
    fields: packages,
    remove,
    update,
    append,
  } = useFieldArray({
    control,
    name: "packages",
  })

  const unitOptions = ["in", "mm", "m"]

  const updatePackageUnit = (index: number, value: string) => {
    const pkg = packages[index]
    update(index, {
      ...pkg,
      unit: value as "in" | "mm" | "m",
    })
  }

  return (
    <div>
      <h3 className="info-card-title">Shipping and Delivery</h3>
      <div className="info-card">
        {/* Weight */}
        <div className="space-y-1">
          <Label htmlFor="weight" className="info-card-label">
            Items Weight
          </Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setValue("weight", Number(e.target.value))}
              className="w-full"
              placeholder="Enter weight"
            />
            <Select
              value={weightUnit}
              onValueChange={(val) =>
                setValue("weightUnit", val as "KG" | "G" | "LB" | "OZ")
              }
              defaultValue="KG"
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {["KG", "G", "LB", "OZ"].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Package Sizes */}
        <div className="space-y-2 mt-4">
          <Label>
            Package Size{" "}
            <span className="text-sm text-muted-foreground">
              (The package you use to ship your product)
            </span>
          </Label>

          {packages.map((pkg, index) => (
            <div
              key={pkg.id || index}
              className="grid grid-cols-4 gap-2 items-end relative"
            >
              {(["length", "breadth", "width"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <Label className="text-sm text-muted-foreground capitalize">
                    {field}
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    defaultValue={0}
                    {...register(`packages.${index}.${field}`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              ))}

              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Unit</Label>
                <Select
                  value={pkg.unit}
                  onValueChange={(val) => updatePackageUnit(index, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {packages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50 absolute right-0 inset-y-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                length: 0,
                breadth: 0,
                width: 0,
                unit: "in",
              })
            }
            className="text-primary hover:text-primary/90 mt-2"
          >
            + Add Another Package
          </Button>
        </div>
      </div>
    </div>
  )
}
