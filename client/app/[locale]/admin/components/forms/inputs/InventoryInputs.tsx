"use client"

import {Input} from "@/components/ui/input"
import {UseFormRegister} from "react-hook-form"
import {Label} from "@/components/ui/label"
import RequiredMark from "@/components/RequiredMark"
import {ProductFormValues} from "@/lib/schema/products.schema"

interface InventoryInputsProps {
  register: UseFormRegister<ProductFormValues>
}

export default function InventoryInputs({register}: InventoryInputsProps) {
  return (
    <div>
      <h3 className="info-card-title">Inventory</h3>
      <div className="info-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
          <div className="space-y-1">
            <Label htmlFor="quantity" className="info-card-label">
              Quantity
              <RequiredMark style="star" />
            </Label>
            <Input
              id="stock"
              type="number"
              placeholder="Enter stock quantity"
              {...register("stock", {valueAsNumber: true})}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="sku" className="info-card-label">
              SKU
              <RequiredMark style="star" />
            </Label>
            <Input id="sku" placeholder="Enter SKU" {...register("sku")} />
          </div>
        </div>
      </div>{" "}
    </div>
  )
}
