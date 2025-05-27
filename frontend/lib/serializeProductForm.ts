// lib/utils/serializeProductForm.ts

export function serializeProductToFormData(data: unknown): FormData {
  const formData = new FormData()
  const jsonKeys = ["packages", "variantFields", "variants"]
  const imageKeys = ["images"]
  const excludedKeys = ["primaryImage"]

  if (typeof data !== "object" || data === null) {
    throw new Error("Input data must be a non-null object")
  }

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
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
