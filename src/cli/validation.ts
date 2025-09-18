import * as zod from "zod"

// ---Zod prompt validator ---
export function zodPtomptValidator<T>(schema: zod.ZodType<T>) {
  return (input: string) => {
    if (input.toLowerCase() === "back") {
      return true
    } else {
      const parsed = schema.safeParse(input)
      return parsed.success ? true : parsed.error.issues[0]!.message
    }
  }
}
