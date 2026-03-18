import { ZodError } from "zod";

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getZodFieldErrors(error: ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
