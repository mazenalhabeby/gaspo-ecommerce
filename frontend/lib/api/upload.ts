// lib/api/upload.ts
export async function uploadProduct(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create product")
  }

  return res.json()
}

export async function uploadCategory(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create category")
  }

  return res.json()
}

export async function uploadEditCategory(slug: string, formData: FormData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`,
    {
      method: "PATCH",
      body: formData,
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to update category")
  }

  return res.json()
}
