import z from "zod"
import { DefaultSchema } from "../Default.Schema"

export const createUserSchema = z
  .object({
    name: z.string().min(3, "Name is too short").max(255, "Name is too long"),
    confirmPassword: z.string()
  })
  .merge(DefaultSchema)
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })
  .strict()
