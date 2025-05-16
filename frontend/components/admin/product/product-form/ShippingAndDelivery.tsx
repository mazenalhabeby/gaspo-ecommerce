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
  useFieldArray,
  Control,
} from "react-hook-form"
import {ProductFormType} from "@/schemas/product.schema"

interface ShippingAndDeliveryProps {
  register: UseFormRegister<ProductFormType>
  setValue: UseFormSetValue<ProductFormType>
  watch: UseFormWatch<ProductFormType>
  control: Control<ProductFormType>
}

export default function ShippingAndDelivery({
  register,
  setValue,
  watch,
  control,
}: ShippingAndDeliveryProps) {
  const weight = watch("weight")
  const weightUnit = watch("weightUnit")

  const {
    fields: packages,
    append,
    remove,
    update,
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
      <h3 className="product-info-card-title">Shipping and Delivery</h3>
      <div className="product-info-card">
        {/* Weight */}
        <div className="space-y-1">
          <Label htmlFor="weight" className="product-info-card-label">
            Items Weight
          </Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setValue("weight", e.target.value)}
              className="w-full"
              placeholder="Enter weight"
            />
            <Select
              value={weightUnit}
              onValueChange={(val) =>
                setValue("weightUnit", val as "kg" | "g" | "lb" | "oz")
              }
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {["kg", "g", "lb", "oz"].map((unit) => (
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
              key={pkg.id}
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
                    {...register(`packages.${index}.${field}` as const)}
                  />
                </div>
              ))}

              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Unit</Label>
                <Select
                  value={pkg.unit}
                  onValueChange={(val) =>
                    updatePackageUnit(index, val as string)
                  }
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
              append({length: "", breadth: "", width: "", unit: "in"})
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
