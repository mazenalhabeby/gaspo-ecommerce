export function beautifySlug(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function slugify(input: string | undefined | null): string {
  if (!input) return ""

  return input
    .normalize("NFKD") // Normalize accented characters
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // Remove non-alphanumeric characters except hyphens
    .replace(/--+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, "") // Trim hyphens from start/end
}
