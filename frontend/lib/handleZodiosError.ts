import {ZodiosError} from "@zodios/core"

export function handleZodiosError(error: unknown): string {
  if (error instanceof ZodiosError) {
    const data = (error as ZodiosError).data
    const apiMessage =
      data && typeof data === "object" && "message" in data
        ? (data as {message?: string}).message
        : undefined
    const fallbackMessage = error.message || "Something went wrong with the API"
    return apiMessage || fallbackMessage
  }

  return "An unexpected error occurred"
}
