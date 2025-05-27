import {defineRouting} from "next-intl/routing"

export const languages = [
  {code: "en", label: "English", flag: "🇬🇧", shortcut: "EN"},
  {code: "de", label: "Deutsch", flag: "🇩🇪", shortcut: "DE"},
]

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
})
