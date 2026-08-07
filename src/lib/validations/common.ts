import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .max(255);

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(120, "Name is too long.");

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Message is required.")
  .max(5000, "Message is too long.");

export const phoneSchema = z
  .string()
  .trim()
  .max(30, "Phone number is too long.")
  .optional()
  .or(z.literal(""));

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.");

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input.";
}
