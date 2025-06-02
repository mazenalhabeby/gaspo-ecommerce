import {languages, type Language, type LanguageCode} from "@/i18n/routing"

export function useSupportedLanguages(): Language[] {
  return languages
}

export function useLanguageLabel(code: LanguageCode): string {
  const lang = languages.find((l) => l.code === code)
  return lang?.label ?? code
}

export function useLanguageFlag(code: LanguageCode): string {
  const lang = languages.find((l) => l.code === code)
  return lang?.flag ?? "🏳️"
}
