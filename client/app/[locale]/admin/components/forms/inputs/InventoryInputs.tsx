"use client"

import {Input} from "@/components/ui/input"
import {UseFormRegister} from "react-hook-form"
import {Label} from "@/components/ui/label"
import RequiredMark from "@/components/RequiredMark"
import {ProductCreate} from "@/lib/schema/products.schema"

interface InventoryInputsProps {
  register: UseFormRegister<ProductCreate>
}

export default function InventoryInputs({register}: InventoryInputsProps) {
  return (
    <div>
      <h3 className="product-info-card-title">Inventory</h3>
      <div className="product-info-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="quantity" className="product-info-card-label">
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
            <Label htmlFor="sku" className="product-info-card-label">
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
