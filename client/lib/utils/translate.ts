export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!text) return ""

  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text",
    }),
  })

  if (!response.ok) {
    throw new Error("Translation failed")
  }

  const data = await response.json()
  return data.translatedText
}
