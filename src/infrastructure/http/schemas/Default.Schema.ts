import { z } from "zod"

export const DefaultSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Email is too short")
      .max(255, "Email is too long")
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password is too long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
  })
  .strict()
