export type DateFormat =
  | "full"
  | "long"
  | "medium"
  | "short"
  | "date"
  | "time"
  | "custom"

interface FormatDateOptions {
  format?: DateFormat
  locale?: string
  customOptions?: Intl.DateTimeFormatOptions
}

export function formatDate(
  input: string | Date | undefined | null,
  options: FormatDateOptions = {}
): string {
  if (!input) return ""

  const date = new Date(input)
  const locale = options.locale || "en-US"

  const defaultFormatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    full: {
      dateStyle: "full",
      timeStyle: "short",
    },
    long: {
      dateStyle: "long",
      timeStyle: "short",
    },
    medium: {
      dateStyle: "medium",
      timeStyle: "short",
    },
    short: {
      dateStyle: "short",
      timeStyle: "short",
    },
    date: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
    },
    custom: {}, // use `customOptions`
  }

  const formatOptions =
    options.format === "custom" && options.customOptions
      ? options.customOptions
      : defaultFormatOptions[options.format || "medium"]

  return new Intl.DateTimeFormat(locale, formatOptions).format(date)
}
