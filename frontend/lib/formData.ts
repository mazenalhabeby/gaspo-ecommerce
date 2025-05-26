/**
 * Safely append a string array to FormData after validation.
 */
export function appendArrayFieldToFormData(
  formData: FormData,
  key: string,
  value: unknown,
  defaultValue: string[] = []
) {
  const validatedArray =
    Array.isArray(value) && value.every((item) => typeof item === "string")
      ? value
      : defaultValue

  formData.append(key, JSON.stringify(validatedArray))
}

/**
 * Generic helper for appending structured arrays (e.g., objects) to FormData.
 */
export function appendJsonFieldToFormData<T>(
  formData: FormData,
  key: string,
  value: unknown,
  fallback: T[] = []
) {
  let parsed: T[] = fallback
  try {
    if (typeof value === "string") {
      parsed = JSON.parse(value)
    } else if (Array.isArray(value)) {
      parsed = value
    }
  } catch {
    parsed = fallback
  }

  formData.append(key, JSON.stringify(parsed))
}
