import {getRequestConfig} from "next-intl/server"
import {routing} from "./routing"
import {hasLocale} from "next-intl"
import fs from "fs"
import path from "path"

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const localeDir = path.join(process.cwd(), "messages", locale)

  const files = fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith(".json"))

  const messages: Record<string, string> = {}

  for (const file of files) {
    const filePath = path.join(localeDir, file)
    const key = file.replace(".json", "")
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    messages[key] = content
  }

  return {locale, messages}
})
