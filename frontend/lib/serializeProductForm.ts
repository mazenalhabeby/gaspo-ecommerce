// lib/utils/serializeProductForm.ts

import {Product} from "@/lib/types/dummyProductdata"

export function serializeProductToFormData(data: Product): FormData {
  const formData = new FormData()
  const jsonKeys = ["packages", "variantFields", "variants"]
  const imageKeys = ["images"]
  const excludedKeys = ["primaryImage"]

  for (const [key, value] of Object.entries(data)) {
    if (excludedKeys.includes(key)) continue

    if (imageKeys.includes(key)) {
      ;(value as File[]).forEach((file) => {
        formData.append(key, file)
      })
    } else if (jsonKeys.includes(key)) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}
