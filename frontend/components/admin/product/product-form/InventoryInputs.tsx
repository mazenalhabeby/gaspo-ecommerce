"use client"

import {Input} from "@/components/ui/input"
import {ProductFormType} from "../../../../schemas/product.schema"
import {UseFormRegister} from "react-hook-form"
import {Label} from "@/components/ui/label"
import RequiredMark from "@/components/RequiredMark"

interface InventoryInputsProps {
  register: UseFormRegister<ProductFormType>
}

export default function InventoryInputs({register}: InventoryInputsProps) {
  return (
    <div>
      <h3 className="product-info-card-title">Inventory</h3>
      <div className="product-info-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quantity (Required) */}
          <div className="space-y-1">
            <Label htmlFor="quantity" className="product-info-card-label">
              Quantity
              <RequiredMark style="star" />
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              {...register("quantity")}
            />
          </div>

          {/* SKU (Optional) */}
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
