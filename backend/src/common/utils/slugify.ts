export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // separate diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with dash
    .replace(/^-+|-+$/g, ''); // trim dashes from start/end
}
