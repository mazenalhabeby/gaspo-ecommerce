import {Language} from "@/i18n/routing"

export function initTranslationFields(
  langs: readonly Language[]
): {language: string; name: string; description: string}[] {
  return langs.map((lang) => ({
    language: lang.code,
    name: "",
    description: "",
  }))
}

export function initTranslationFieldsProducts(langs: readonly Language[]): {
  language: string
  name: string
  description: string
  seoTitle: string
  seoDesc: string
  descriptionJson: string
}[] {
  return langs.map((lang) => ({
    language: lang.code,
    name: "",
    description: "",
    seoTitle: "",
    seoDesc: "",
    descriptionJson: JSON.stringify({text: "", blocks: []}, null, 2), // Initialize with empty JSON structure
  }))
}
