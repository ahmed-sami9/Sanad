import type { z } from "zod";
import { AppError } from "./AppError";

// Parses untrusted input; the returned value is the cleaned data (trimmed, lowercased...), not the raw body.
export function parseInput<T extends z.ZodType>(schema: T, input: unknown): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, "VALIDATION_ERROR", "Invalid input");
  return result.data;
}
