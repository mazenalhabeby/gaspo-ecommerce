"use client"

import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {UseFormSetValue, UseFormWatch} from "react-hook-form"
import RequiredMark from "@/components/RequiredMark"
import {ProductFormValues} from "@/lib/schema/products.schema"
import {currencyOptions} from "../../../data/currancy-avalible"

interface PricingProps {
  setValue: UseFormSetValue<ProductFormValues>
  watch: UseFormWatch<ProductFormValues>
}

export default function Pricing({setValue, watch}: PricingProps) {
  const price = watch("price")
  const currency = watch("currency")

  return (
    <div>
      <h3 className="info-card-title">Pricing</h3>
      <div className="info-card">
        <div className="space-y-1">
          <Label htmlFor="price" className="info-card-label">
            Price
            <RequiredMark style="star" />
          </Label>
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
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price ?? ""}
              onChange={(e) => setValue("price", Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
